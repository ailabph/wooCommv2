# iRefer Vendor Plugin For Woocommerce 2.0.9

# Features
- I-Refer has its own Admin dashboard in the Wordpress Admin
- Adds I-Refer payment gateway to the list of Woocommerce payment gateways
- Dynamic filtering of payment options. If buyer comes from I-refer, it automatically hides other payment gateways. Otherwise, it hide's itself and enables the other default payment gateway of the vendor
- Optimized B2B requests. Only communicates once to the Integration API, to update the consumer key and secret key.
- Automatically creates the order and puts on-hold for payment when redirected to the I-refer checkout
- Added security: Encrypted payload to checkout page
- Implemented B2B callback if payment is successful
- Added security: HMAC SHA-256 to authenticate callback requests for successful payments
- Cron jobs for batch jobs for B2B communications
- I-Refer customized REST API
    - Retrieve Order Details
    - Retrieve Product Details
    - Update Order for Successful Payment
    - Cancel Order

# Installation - Manual
### Option 1:
1. Zip the 'i-refer' folder inside the repo
2. Login as admin in Vendor Wordpress
3. Go to Plugins > Add New Plugin
4. Click 'Upload Plugin' and Upload Zip
5. Install & Activate

### Option 2:
1. Zip the 'i-refer' folder inside the repo
2. Upload zip inside '/wp-contents/plugin' folder
3. Unzip contents
4. Login as admin in Vendor Wordpress
5. Install & Activate I-Refer 2.0 plugin

# Checkout Process

1. When user checks out and proceed for payment, the following information is passed to I-Refer Checkout Page:


```json
{
  "vendor_site": "https://example.com",
  "order_id": 12345,
  "fname": "John",
  "lname": "Doe",
  "email": "john.doe@example.com",
  "contact": "09121231234",
  "shipping_method": "Standard Shipping",
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "company": "Example Corp",
    "address_1": "123 Example St",
    "address_2": "Suite 100",
    "city": "Exampleville",
    "state": "EX",
    "postcode": "12345",
    "country": "US"
  },
  "currency": "USD",
  "shipping_total": "10.00",
  "tax": "2.00",
  "subtotal": "12.00",
  "amount": "112.00",
  "items": [
    {
      "prod_id": 987,
      "prod_name": "Example Product",
      "desc": "Example Product Description",
      "price": "100.00",
      "qty": 1,
      "img_url": "https://example.com/product.jpg",
      "total": "100.00",
      "variant_info": {
        "size": "M",
        "color": "Red"
      }
    }
  ],
  "return_url": "https://example.com/return",
  "callback_url": "https://example.com/callback"
}

```

2. The plugin will then encrypt this json payload using AES-256 with the secret key of the vendor
3. It will then pass it to the I-Refer Checkout via URL Parameters. 'referral_token' and 'p' (meaning payload)
3. The checkout page will receive the payload, example: checkout.dev.i-refer.app/summary?referral_token=abc123&p=bQ38nm1TXtlnJEiPN...
4. On the Checkout Server, it would need to do the following:
    1. Verify referral_token
    2. Retrieve the vendor_id from the referral_token
    3. Retrieve the secret key of the vendor
    4. Use AES-256 to decrypt the encrypted payload stored in the 'p' parameter in the URL
    5. If successful, you should get a valid JSON string
    6. Process the payment from the user
    7. Once successful, server will callback to vendor to notify successful payment (see more details below)
    8. On the checkout page, use 'return_url' to redirect user back to the vendor thank you page

## Sample Encrypt & Decrypt AES-256-CBC for Javascript / Typescript

```javascript
const crypto = require('crypto');

function encrypt(json_text, key_string) {
  const data = Buffer.from(JSON.stringify(json_text));
  const key = crypto.createHash('sha256').update(key_string).digest().slice(0, 32); // Ensure the key is 32 bytes
  const iv = crypto.randomBytes(16); // AES block size is 16 bytes
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return Buffer.concat([iv, encrypted]).toString('base64'); // Prepend IV for use in decryption
}

function decrypt(ciphertext, key_string) {
  const data = Buffer.from(ciphertext, 'base64');
  const key = crypto.createHash('sha256').update(key_string).digest().slice(0, 32);
  const iv = data.slice(0, 16); // Extract the IV (initial 16 bytes)
  const encryptedText = data.slice(16); // Get the actual ciphertext
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return JSON.parse(decrypted.toString());
}

let encrypted_text = "VvKyHT76m9p7zbg+DiAA8t/nOlHr/9uR7dO00yqAG6IhbLWggRT8SgX/6iy3IafLbnpo1d/PYvUgEwBHBmsLyLN/ide4eleyuDX5DOS8Wa7yrVuZe47k804reUXq1gYEtlfW7ffcdZoZwCrARNY8Q8UmB5gDhnFK7CoLVq2bp44kkFH1RUf6eYNJjiqU9ti2VMsRaa4aQhSfE12/8K72rKDnVfDpCRmaTG0Xim7rVMY48tuBxd+2wnyIGBdbpc/PpLpEqMOVlnTKwQjDfNGtwCNfTZlyPyqEgy9w9Yeffy+QnpnyL7k5OtwR++NoWXIEXVya/dXLwAv6MKPclH+SLMHGFdip8r5IjscM+P5mTh0JbzjVpNXgKLalwUcP8lWc6IpnXV+3cK60NdgvrewJfQ0TkrMnfZozwpnyBg4EPqNxQXNfWmdBblCSdDd6jpgTgKAfneUKyjld4RSS1pnTkw7LOLtUi1kOqB4KA+2Jdb1NrsEnT9S62nTkBLI7KMaily0Yj8jXUOXWfvSt3ftLf+soXLs5Sl+G3HfRQ29uKPQVIUPtBeIgjbM92MaZuHnR9MlL4UJlql54X01xzOaJE3CvdoYkem9Qa65Hp4305HmfPVhdMQRFDJCZcg1lcTmqdIeSP47WxrCigKcjOyOEn/Xz4AMiI1yDrBvhy6KFN3bNzhajhnkTGbnTP0FD/OpB9R41DTCCpG0zTUpYdqBRzxW13rF+mjBuqYXv3YpYBwHmzI5GxH/g5Bqdy+jUuR9wIuQAF8UxzB8dXG4RUNIJxGDNHlIcIP9LRFWjJM/COFEWPNt1iRTXxXecjD65N6WUwUkhyemalX22LIRk5KeEKwCuqrUNd+cdpb7SLMRomq40Y1t3FpvMKB9BA9vC9i2TfFXokKnbDRyzi7QNizOc/Rpq93bW8nPSZaB2S4M1ZTlgSj/qx/XH/zSqfhMf8VMVQpPhQXZ2K/PGJ07jZK26TUslMrkvTE6XfQDfRgGJiPFm11CUefQVuI6N417Hjy8MA4VnNl2lqwsbrUYs9HxwgVZpnk9qltkM6zX3FQyBuHOQpOt72MVuoH0aAeobYNLTdoWv3eBUqTP5K7n1S9PpQqpxbtxGdIySY7cW8eVL2fipCT+VPedEVv79JRyeJgR/5tOT6hSWjgUVdxdOFef6qUNHaLiuz8AcPzgHXnzSjUfQPf2EaAPWCY/8FCYqpt5x";
let vendor_secret_key = "cs_4b930e43aacbd63a4a3d1ccc34c803796e54e169"
let vendor_secret_key_32_bit = "cs_4b930e43aacbd63a4a3d1ccc34c80";

let decrypted_json_raw = decrypt(encrypted_text, vendor_secret_key_32_bit)
let decrypted_json = JSON.parse(decrypted_json_raw)

console.log(decrypted_json);
```

result
```json
(
    [vendor_site] => https://skyzstore.com
    [order_id] => 101
    [fname] => Danny
    [lname] => Almaden
    [email] => wcd@i-refer.global
    [shipping_total] => 0
    [shipping_method] => 
    [shipping_address] => Array
        (
            [first_name] => 
            [last_name] => 
            [company] => 
            [address_1] => 
            [address_2] => 
            [city] => 
            [state] => 
            [postcode] => 
            [country] => 
        )

    [currency] => USD
    [tax] => 0
    [amount] => 5.00
    [items] => Array
        (
            [0] => Array
                (
                    [prod_id] => 13
                    [prod_name] => Test product
                    [desc] => Test product
                    [price] => 5
                    [qty] => 1
                    [img_url] => https://skyzstore.com/wp-content/uploads/2024/01/glowstick.jpg
                    [total] => 5
                    [variant_info] => Array
                        (
                        )

                )

        )

    [return_url] => https://skyzstore.com/checkout/order-received/101/?key=wc_order_eD70DFJINmtYz
    [callback_url] => https://skyzstore.com/wp-json/irefer/v2/update_order/
)
```

# Successful Payment - Notify vendor via callback

1. After successful payment, use the 'callback_url' to notify the vendor that order has been paid
2. Type: POST
3. Payload structure:
```json
{
  "order_id": 105,
  "email": "wcd@i-refer.global",
  "status": "paid" or "cancelled"
}
```

4. For security purposes, additional header 'x-irefer-hash' is required. Hash to use is HMAC SHA-256. Hash the payload as shown above and use the vendor secret key. Make sure that there is not whitesspaces in the json payload. Below is an example on how to implement in Javascript / Typescript:

```javascript
function str2ab(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Function to generate an HMAC using SHA-256
async function generateHmac(secretKey, data) {
  // Import the secret key for HMAC
  const key = await crypto.subtle.importKey(
    "raw",
    str2ab(secretKey),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign", "verify"]
  );

  // Sign the data with the HMAC key
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    str2ab(data)
  );

  // Convert the signature (ArrayBuffer) to a hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

let data ={
  "order_id": "107",
  "email": "wcd@i-refer.global",
  "status": "paid"
}

let data_json = JSON.stringify(data);
// Remove all whitespaces in data_json
data_json = data_json.replace(/\s+/g, '');
console.log(data_json);

let secret_key = "cs_dbf271f76ba288a9a07081f6863e4c4419c68bf8";

generateHmac(secret_key, data_json).then(r=>{
  console.log(r);
})
```
5. After generating the hash, POST the payload with the x-irefer-hash to 'callback_url'. Example the payload below:
```
POST https://skyzstore.com/wp-json/irefer/v2/update_order
Content-Type: application/json
x-irefer-hash: a39840348a57c3886328ec652d4cb0431a9ce98db9d2c664eabf19d64f09bf63

{
  "order_id": "107",
  "email": "wcd@i-refer.global",
  "status": "paid"
}
```
6. After posting, if successful, you will receive a 200 Response with a message below:

```json
"Order status updated successfully"
```

## Possible Errors on Callback

```json
{
  "code": "invalid_status",
  "message": "Order status not updated. The order is not on-hold or the requested status is not pending.",
  "data": {
    "status": 400
  }
}
```

```json
{
  "code": "hash_mismatch",
  "message": "The provided hash does not match the computed hash.",
  "data": {
    "status": 403
  }
}
```

```json
{
  "code": "missing_hash",
  "message": "The x-irefer-hash header is missing.",
  "data": {
    "status": 400
  }
}
```

```json
{
  "code": "rest_missing_callback_param",
  "message": "Missing parameter(s): order_id",
  "data": {
    "status": 400,
    "params": [
      "order_id"
    ]
  }
}
```

```json
{
  "code": "no_order",
  "message": "No order found for provided ID",
  "data": {
    "status": 404
  }
}
```

---

## I-Refer REST API

### Get Product Details

Endpoint: `/wp-json/irefer/v2/get-product/`

Method: GET

Description: Retrieves the full details of a WooCommerce product based on the provided product ID or slug.

Parameters:
- `id` (optional): The ID of the product to retrieve.
- `slug` (optional): The slug of the product to retrieve.

Note: Either the `id` or `slug` parameter must be provided.

Response:
- `200 OK`: Returns the full details of the product in JSON format.
- `400 Bad Request`: Returned if neither the `id` nor `slug` parameter is provided.
- `404 Not Found`: Returned if no product is found for the provided ID or slug.

Sample Usage:

1. Get product by ID:
   ```
   GET https://example.com/wp-json/irefer/v2/get-product/?id=123
   ```

   Response (200 OK):
   ```json
   {
     "product": {
       "id": 123,
       "name": "Sample Product",
       "slug": "sample-product",
       "permalink": "https://example.com/product/sample-product/",
       "date_created": "2023-06-01 10:00:00",
       "date_created_gmt": "2023-06-01 08:00:00",
       "date_modified": "2023-06-02 15:30:00",
       "date_modified_gmt": "2023-06-02 13:30:00",
       "type": "simple",
       "status": "publish",
       "featured": false,
       "catalog_visibility": "visible",
       "description": "This is a sample product.",
       "short_description": "A short description of the sample product.",
       "sku": "SAMPLE-001",
       "price": "10.00",
       "regular_price": "10.00",
       "sale_price": "",
       "date_on_sale_from": null,
       "date_on_sale_from_gmt": null,
       "date_on_sale_to": null,
       "date_on_sale_to_gmt": null,
       "on_sale": false,
       "purchasable": true,
       "total_sales": 0,
       "virtual": false,
       "downloadable": false,
       "downloads": [],
       "download_limit": 0,
       "download_expiry": 0,
       "external_url": "",
       "button_text": "",
       "tax_status": "taxable",
       "tax_class": "",
       "manage_stock": false,
       "stock_quantity": null,
       "in_stock": true,
       "backorders": "no",
       "backorders_allowed": false,
       "backordered": false,
       "sold_individually": false,
       "weight": "",
       "dimensions": {
         "length": "",
         "width": "",
         "height": ""
       },
       "shipping_required": true,
       "shipping_taxable": true,
       "shipping_class": "",
       "shipping_class_id": 0,
       "reviews_allowed": true,
       "average_rating": "0.00",
       "rating_count": 0,
       "upsell_ids": [],
       "cross_sell_ids": [],
       "parent_id": 0,
       "purchase_note": "",
       "categories": [],
       "tags": [],
       "images": [],
       "attributes": [],
       "default_attributes": [],
       "variations": [],
       "grouped_products": [],
       "menu_order": 0,
       "price_html": "<span class=\"woocommerce-Price-amount amount\"><bdi><span class=\"woocommerce-Price-currencySymbol\">&#36;</span>10.00</bdi></span>",
       "related_ids": [],
       "meta_data": [],
       "_links": {
         "self": [
           {
             "href": "https://example.com/wp-json/irefer/v2/get-product/123"
           }
         ],
         "collection": [
           {
             "href": "https://example.com/wp-json/irefer/v2/get-product"
           }
         ]
       }
     }
   }
   ```

2. Get product by slug:
   ```
   GET https://example.com/wp-json/irefer/v2/get-product/?slug=sample-product
   ```

   Response (200 OK):
   ```json
   {
     "product": {
       "id": 123,
       "name": "Sample Product",
       "slug": "sample-product",
       ...
     }
   }
   ```

3. Error response when no ID or slug is provided:
   ```
   GET https://example.com/wp-json/irefer/v2/get-product/
   ```

   Response (400 Bad Request):
   ```json
   {
     "code": "missing_parameter",
     "message": "Please provide either a product ID or slug",
     "data": {
       "status": 400
     }
   }
   ```

4. Error response when product is not found:
   ```
   GET https://example.com/wp-json/irefer/v2/get-product/?id=999
   ```

   Response (404 Not Found):
   ```json
   {
     "code": "no_product",
     "message": "No product found for provided ID or slug",
     "data": {
       "status": 404
     }
   }
   ```

The `/get-product/` endpoint allows retrieving the full details of a WooCommerce product by providing either the product ID or slug. It returns a comprehensive set of product information, including basic details, pricing, inventory, shipping, categories, tags, and more. This endpoint can be useful for integrating with external systems or building custom functionality that requires access to product data.

---

## Other Notes

```
composer update
composer install --no-dev --prefer-dist
composer dumpautoload -o

npm run publish
or
zip -r i-refer.zip i-refer/

```
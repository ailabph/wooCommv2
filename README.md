# Introduction 
TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project. 

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# API Reference

## Vendor

### GET /vendor/refer_product
Refer a product from a vendor's store.

Query Parameters:
- `storeurl` (required) - The URL of the vendor's store 
- `productid` (required) - The ID of the product to refer

Returns the product data.

### POST /vendor/add_or_update_vendor 
Add or update a vendor.

Request Body:
- `consumer_key` (required) - The vendor's consumer key
- `storeurl` (required) - The URL of the vendor's store
- `consumer_secret` (required) - The vendor's consumer secret

Returns a success message.

## Product

### GET /product/refer_product
Refer a product.

Query Parameters: 
- `storeurl` (required) - The URL of the store
- `producturl` (required) - The URL of the product

Returns the product data.

### GET /product/is-valid-product-url
Check if a product URL is valid.

Query Parameters:
- `storeurl` (required) - The URL of the store
- `producturl` (required) - The URL of the product 

Returns `true` if valid, `false` otherwise.

### GET /product/product-via-slug-wp-api
Get product info by slug using the WordPress API.

Query Parameters:
- `storeurl` (required) - The URL of the WordPress store
- `productslug` (required) - The slug of the product

Returns the product data.

## Health

### GET /health/check
Health check endpoint. Returns "OK" if the service is running.

# Build and Test
TODO: Describe and show how to build your code and run the tests.

# Contribute  
TODO: Explain how other users and developers can contribute to make your code better.

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)

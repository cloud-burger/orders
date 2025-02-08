Feature: Update Product API

    @cleanup
    Scenario: Updating a new product
        Given that the product has already been created
        When I try to update the product
        Then I should receive a OK response
        And the updated product data is returned
    
    Scenario: Trying to update a product that not exists
        When I try to update the product with an id that not exists
        Then I should receive a not found response error
        And the message error received is "Product not found"

    Rule: The product data should be validated 

        Scenario: Trying to update a product with a parameter that not exists
            Given that I have a data with the field "<param>" that not exists
            When I try to update the product
            Then I should receive a bad request response error
            And the message error received is "Invalid request data"
            And the error of invalid param "<param>" is "<error>"
        Examples:
                | param  | error               |
                | test   | test is not allowed |

        Scenario: Trying to create a product without a required parameter
            Given that the data product do not have the parameter "<param>"
            When I try to update the product
            Then I should receive a bad request response error
            And the message error received is "Invalid request data"
            And the error of invalid param "<param>" is "<error>"
        Examples:
                | param         | error                           |
                | name          | Product name is required        |
                | category      | Product category is required    |
                | description   | Product description is required |
                | amount        | Product amount is required      |
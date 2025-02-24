Feature: Create Product API

    @cleanup
    Scenario: Creating a new product
        When I try to create a new product
        Then I should receive a success response
        And the same product data is returned
    
    @cleanup
    Scenario: Trying to create a duplicated product
        Given that the product has already been created
        When I try to create the same product
        Then I should receive a conflict response error
        And the message error received is "Product already exists"

    Rule: The product data should be validated 

        Scenario: Trying to create a product with a parameter that not exists
            Given that I have a data with the field "<param>" that not exists
            When I try to create a new product
            Then I should receive a bad request response error
            And the message error received is "Invalid request data"
            And the error of invalid param "<param>" is "<error>"
        Examples:
                | param  | error          |
                | test   | test is not allowed |

        Scenario: Trying to create a product without a required parameter
            Given that the data product do not have the parameter "<param>"
            When I try to create a new product
            Then I should receive a bad request response error
            And the message error received is "Invalid request data"
            And the error of invalid param "<param>" is "<error>"
        Examples:
                | param         | error                           |
                | name          | Product name is required        |
                | category      | Product category is required    |
                | description   | Product description is required |
                | amount        | Product amount is required      |
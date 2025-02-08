Feature: Delete Product API

    @cleanup
    Scenario: Deleting a product
        Given that the product has already been created
        When I try to delete the product
        Then I should receive a success with no content response
    
    Scenario: Trying to delete a product that not exists
        When I try to delete the product with an id that not exists
        Then I should receive a not found response error
        And the message error received is "Product not found"

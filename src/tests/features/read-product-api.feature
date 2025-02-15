Feature: Read Product API

    Scenario: Linsting products by category
        When a search of products by "<category>" category is requested
        Then I should receive a OK response
        And a list of this products is returned
        And with the "<category>" category 
    Examples:
            | category  |
            | BURGER    |
            | SIDE      |
            | DRINK     |
            | DESSERT   |

    @cleanup
    Scenario: Find a product in their category list
        Given that the product has already been created
        When a search of product by category is requested
        Then I should receive a OK response
        And a list with this products is returned



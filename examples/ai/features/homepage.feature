Feature: Home Page

  Scenario: Check homepage header
    Given I am on home page
    # intentionally fails
    Then I see header "Cucumber"

  Scenario: Check get started
    Given I am on home page
    When I click link "Get started"
    # intentionally fails
    Then I see header "About"

  Scenario: Add Instant Pot to Amazon Cart
    Given I am on Amazon homepage
    When I search for "Instant Pot"
    And I click on product "Instant Pot Duo 7-in-1"
    And I click "Add to Cart" button
    Then I should see item added to cart confirmation
    And cart count should be "1"
    And cart subtotal should be "$102.60"

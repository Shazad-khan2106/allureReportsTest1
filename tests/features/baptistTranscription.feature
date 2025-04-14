Feature: validating baptist transcription

  Scenario: Baptist trascription check
    Given I open the baptist login page
    When I enter "username" and "password"
    Then I should see the homepage
    And I click on the chatbot
    And I click on the mic icon
    And I speak "Hey, Luna can you book an appointment for me"
    Then I should see "Hey, Luna can you book an appointment for me" in the input bar

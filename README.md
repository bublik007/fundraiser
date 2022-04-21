# Fundraiser DApp
This DApp allows beneficiaries, i.e., any entities looking for funding, to create their fundraisers and receive donations in ether from public.

## Prerequisites
In Solidity, two different address types are available: the address type and the address payable type. In contrast to the address type, payable addresses can receive ether, thus they have the transfer and send methods available. 

In this project, we assume that beneficiaries have payable addressed in currency exchanges like Coinbase - these addresses can not be used to send transactions.
Therefore, beneficiary need to have an additional non-payable address for the "custodian" purposes: this address will be given the ability to issue the transaction for transfering funds collected by the Fundraiser contract to the beneficiary's payable address.

## User Interface
The web page of the Fundraiser DApp has the Create New Fundraiser button to initiate the creation of a new fundraiser and the list of previously created fundraisers. By clicking on the Create New Fundraiser button, the user navigates to another page for providing the details about the fundraising and the beneficiary's address. Once the information is submitted, a transaction will be sent to the blockchain to create the fundraiser. When the transaction completes, the user will be taken to the fundraiser's info page; this is the same page users would navigate to from the home page when clicking on an existing fundraiser. The info page shows all the info about the fundraising, including how many donations have been made and the total dollar value of those donations. In this page, the user can make a donation. By clicking on the Request Receipt button, users will see a receipt view of all their donations.

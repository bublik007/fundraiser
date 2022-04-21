# Fundraiser DApp
This DApp allows beneficiaries, i.e., any entities looking for funding, to create their fundraisers and receive donations in ether from the public.
The inspiration for the DApp idea, as well as for some functionality, comes from the "Hands-On Smart Contract Development with Solidity and Ethereum" book by Kevin Solorio, Randall Kanna, and David H. Hoover, published by O'Reilly Media.

## Implementation Details
### Beneficiary Addresses
In Solidity, two different address types are available: the address type and the address payable type. In contrast to the address type, payable addresses can receive ether, thus they have the transfer and send methods available. 

In this project, we assume that beneficiaries have payable addresses in currency exchanges like Coinbase, which can be complicated to use for sending transactions.
Therefore, the beneficiary needs to have an additional non-payable address for the "custodian" purposes: this address will be given the ability to issue the transaction for transferring funds collected by the Fundraiser contract to the beneficiary's payable address. As a result, in the fundraiser contract, we use two addresses: the "custodian" address and the beneficiary payable address.

## User Interface
The web page of the Fundraiser DApp has the Create New Fundraiser button to initiate the creation of a new fundraiser and the list of previously created fundraisers. By clicking on the Create New Fundraiser button, the user navigates to another page for providing the details about the fundraising and the beneficiary's address. Once the information is submitted, a transaction will be sent to the blockchain to create the fundraiser. When the transaction completes, the user will be taken to the fundraiser's info page; this is the same page users would navigate to from the home page when clicking on an existing fundraiser. The info page shows all the info about the fundraising, including how many donations have been made and the total dollar value of those donations. In this page, the user can make a donation. By clicking on the Request Receipt button, users will see a receipt view of all their donations.

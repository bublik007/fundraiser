const FundraiserContract = artifacts.require("Fundraiser");

contract("Fundraiser", accounts => {
  
  /// Variables ///
  let fundraiser;
  const name = "Beneficiary Name";
  const url = "beneficiaryname.org";
  const imageUrl = "https://placekitten.com/600/350";
  const description = "Beneficiary description";

  const beneficiary = accounts[1];
  const manager = accounts[0];

  /// Testing ///	
  
  // This action will be completed before each test //
  beforeEach (async () => {
      	fundraiser = await FundraiserContract.new(name, url, imageUrl, description, beneficiary, manager);
  });  

  // Tests dedicatedto the initialization of the contract //
  describe("Initialization", () => {
	it("gets the beneficiary name", async () => {
  		const actual = await fundraiser.name();
  		assert.equal(actual, name, "names should match");
	});
	it("gets the url", async () => {
  		const actual = await fundraiser.url();
  		assert.equal(actual, url, "urls should match");
	});
	it("gets the image url", async () => {
  		const actual = await fundraiser.imageUrl();
  		assert.equal(actual, imageUrl, "image urls should match");
	});
	it("gets the description", async () => {
  		const actual = await fundraiser.description();
  		assert.equal(actual, description, "descriptions should match");
	});
	
	it("gets the beneficiary", async() =>{
		const actual = await fundraiser.beneficiary();
		assert.equal(actual, beneficiary, "beneficiary should match");
	});	
	
	it("gets the manager/owner", async() =>{
		const actual = await fundraiser.owner();
		assert.equal(actual, manager, "manager/owner should match");	
	});
  });

 // Ownership-related tests
 describe("Set beneficiary", () => {
	const newBeneficiary = accounts[2];

  	it("updates beneficiary when called by owner account", async () => {
    		await fundraiser.setBeneficiary(newBeneficiary, {from: manager});
    		const actualBeneficiary = await fundraiser.beneficiary();
    		assert.equal(actualBeneficiary, newBeneficiary, "beneficiaries should match");
  	});

  	it("throws an error when called from a non-owner account", async () => {
    		try {
      			await fundraiser.setBeneficiary(newBeneficiary, {from: accounts[3]});
      			assert.fail("setting a new beneficiary is not restricted to owners")
    		} catch(err) {
      			const expectedError = "Ownable: caller is not the owner";
      			const actualError = err.reason;
      			assert.equal(actualError, expectedError, "should not be permitted");
    		}
  	});// end of it			  		
 });// end of describe

 // Donations-related tests //
 describe("Making donations", () => {
    const value = web3.utils.toWei('0.0289');
    const donor = accounts[2];

    it("increases myDonationsCount", async () => {
  	const currentDonationsCount = await fundraiser.myDonationsCount({from: donor});
  	await fundraiser.donate({from: donor, value});
  	const newDonationsCount = await fundraiser.myDonationsCount({from: donor});
  	assert.equal(1, newDonationsCount - currentDonationsCount, "myDonationsCount should increment by 1");
    });

   it("includes donation in myDonations", async ()=>
   {
   	await fundraiser.donate({from:donor, value});
	const {values, dates} = await fundraiser.myDonations({from:donor});
	assert.equal(value, values[0], "values should match");
	assert(dates[0], "date should be presented");
   });

    it("sums up new donation to total donations sum", async () => {
	const currentDonationsSum = await fundraiser.myDonationsSum({from: donor});    
	await fundraiser.donate({from: donor, value});
	const newDonationsSum = await fundraiser.myDonationsSum({from: donor});
	assert.equal(value, newDonationsSum - currentDonationsSum, "myDonationsSum should increment by " + value);
    });

	it("Increases the total donations amount", async () =>
 	{
		const currentTotalDonation = await fundraiser.totalDonationsSum();
		await fundraiser.donate({from: donor, value});
		const newTotalDonation = await fundraiser.totalDonationsSum();
		assert.equal(value, newTotalDonation - currentTotalDonation, "totalDonation should be incremented by " + value);	
	});

	it("Increases donations count", async () => 
	{
		const currentTotalDonationsCount = await fundraiser.totalDonationsNumber();
		await fundraiser.donate({from:donor, value});
		const newTotalDonationsCount = await fundraiser.totalDonationsNumber();
		assert.equal(1, newTotalDonationsCount - currentTotalDonationsCount, "TotalDonationsCount should increase by one");
	});

	it("emits the DonationReceived event", async () => {
 		const tx = await fundraiser.donate({from: donor, value});
  		const expectedEvent = "DonationReceived";
  		const actualEvent = tx.logs[0].event;
  		assert.equal(actualEvent, expectedEvent, "events should match");
	});
  });

  describe("withdrawing funds", () => 
  {
	beforeEach(async () => {
    		await fundraiser.donate(
      			{from: accounts[2], value: web3.utils.toWei('0.1')});
  	});
	

	describe("access controls", () => {
    		it("throws an error when called from a non-owner account", async () => {
      			try {
        			await fundraiser.transferDonationsToTheBeneficiary({from: accounts[3]});
        			assert.fail("withdraw was not restricted to owners")
      			} catch(err) {
        			const expectedError = "Ownable: caller is not the owner"
        			const actualError = err.reason;
        			assert.equal(actualError, expectedError, "should not be permitted")
      			}
    		});

    		it("permits the owner to call the function", async () => {
      			try
			{
        			await fundraiser.transferDonationsToTheBeneficiary({from: manager});
        			assert(true, "no errors were thrown");
      			} 
			catch(err) 
			{
        			assert.fail("should not have thrown an error");
      			}
    		});


		it("transfers the funds to beneficiary", async () => 
		{
			const currentContractBalance = await web3.eth.getBalance(fundraiser.address);
  			const currentBeneficiaryBalance = await web3.eth.getBalance(beneficiary);
			await fundraiser.transferDonationsToTheBeneficiary({from: manager});

			const newContractBalance = await web3.eth.getBalance(fundraiser.address);
			const newBeneficiaryBalance = await web3.eth.getBalance(beneficiary);
			const beneficiaryDifference = newBeneficiaryBalance - currentBeneficiaryBalance;
			
			assert.equal(
    				newContractBalance,
    				0,
    				"contract should have a 0 balance"
  			);
  			assert.equal(
    				beneficiaryDifference,
    				currentContractBalance,
    				"beneficiary should receive all the funds"
  			);
		});
		
		it("emits Withdraw event", async () => {
  			const tx = await fundraiser.transferDonationsToTheBeneficiary({from: manager});
  			const expectedEvent = "DonationTransferedToTheBeneficiary";
  			const actualEvent = tx.logs[0].event;

  			assert.equal(
    				actualEvent,
    				expectedEvent,
    				"events should match"
  			);
		});
  	});
  });


  describe("fallback function", () => {
  	const value = web3.utils.toWei('0.0289');

  	it("increases the totalDonations amount", async () => {
    		const currentTotalDonations = await fundraiser.totalDonationsSum();
    		await web3.eth.sendTransaction(
      			{to: fundraiser.address, from: accounts[9], value}
    	);
    	const newTotalDonations = await fundraiser.totalDonationsSum();

    	const diff = newTotalDonations - currentTotalDonations;

    	assert.equal(
     		diff,
      		value,
      		"difference should match the donation value");
  	});

  	it("increases donationsCount", async () => {
    		const currentDonationsCount = await fundraiser.totalDonationsNumber();
    		await web3.eth.sendTransaction(
      			{to: fundraiser.address, from: accounts[9], value});
	    	const newDonationsCount = await fundraiser.totalDonationsNumber();

    		assert.equal(
      			1,
      			newDonationsCount - currentDonationsCount,
      			"donationsCount should increment by 1");
  	});
 });

});
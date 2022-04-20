pragma solidity ^0.8.0;

import "./Fundraiser.sol";

contract FundraiserFactory 
{
	uint256 constant maxLimit = 20;

	Fundraiser[] private _fundraisers;

	event FundraiserCreated(Fundraiser indexed fundraiser, address indexed owner);

   	function fundraisersCount() public view returns(uint256) {
       		return _fundraisers.length;
   	}

	function createFundraiser(string memory name, 
				 	string memory url, 
					string memory imageURL, 
					string memory description, 
					address payable beneficiary)
	public
	{
		Fundraiser f = new Fundraiser(name, url, imageURL, description, beneficiary, msg.sender);
		_fundraisers.push(f);	
		emit FundraiserCreated(f,msg.sender);
	}


	function fundraisers(uint256 limit, uint256 offset)
    	public
    	view
    	returns(Fundraiser[] memory coll)
	{
		require(offset <= fundraisersCount(), "offset out of bounds");

		uint256 size = _fundraisers.length - offset;
		size = size > limit ? limit: size;
		size = size < maxLimit ? size : maxLimit;
		coll = new Fundraiser[](size);

		for(uint256 i = 0; i < size; i++)
		{
        		coll[i] = _fundraisers[offset + i];
    	}
    	return coll;
	}
}
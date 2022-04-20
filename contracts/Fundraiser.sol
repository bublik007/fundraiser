pragma solidity >=0.8.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";


contract Fundraiser is Ownable
{
	using SafeMath for uint256;

	event DonationReceived(address indexed donor, uint256 value);
	event DonationTransferedToTheBeneficiary(uint256 date, uint256 value);

	struct Donation 
	{
    		uint256 value;
    		uint256 date;
	}
	
	mapping(address => Donation[]) private _donations;
	
	string public name;
	string public url;
	string public imageUrl;
	string public description;

	address payable public beneficiary;
	address public manager;
	
	uint256 public totalDonationsSum = 0;
	uint256 public totalDonationsNumber = 0;

	constructor(string memory _name, string memory _url, string memory _imageUrl, string memory _description,
			address payable _beneficiary, address _manager) public 
	{
    		name = _name;
		url = _url;
		imageUrl = _imageUrl;
		description = _description;

		beneficiary = _beneficiary;
		transferOwnership(_manager);
	}
	function donate() public payable
	{
		Donation[] storage donations = _donations[msg.sender];
		Donation memory d = Donation({value: msg.value, date: block.timestamp});
	 	donations.push(d); 
		totalDonationsSum = totalDonationsSum.add(msg.value);
		totalDonationsNumber = totalDonationsNumber.add(1);
		emit DonationReceived(msg.sender, msg.value);
				
	}
	function setBeneficiary(address payable _beneficiary) public onlyOwner
	{
    		beneficiary = _beneficiary;
	}
	
	function myDonationsCount() public view returns(uint256)
	{
		Donation[] memory donations = _donations[msg.sender];
		return donations.length;
	}
	
	function myDonationsSum() public view returns(uint256)
	{
		Donation[] memory donations = _donations[msg.sender];
		uint256 donationsSum = 0;
		for(uint i=0; i< donations.length; i++)
		{
			donationsSum += donations[i].value;	
		}
		return donationsSum;
	}
	
	function myDonations() public view returns(uint256[] memory values, uint256[] memory dates)
	{
		Donation[] storage donations = _donations[msg.sender];
		uint256 donations_length = donations.length;
		values = new uint256[](donations_length);
		dates = new uint256[](donations_length);
		
		for (uint256 i = 0; i < donations_length; i++)
		{
			Donation storage donation = donations[i];
			values[i] = donation.value;
			dates[i] = donation.date; 
		}
		
		return (values, dates);		
	}
	
	function transferDonationsToTheBeneficiary() public onlyOwner
	{
		uint256 balance = address(this).balance;
		beneficiary.transfer(balance);
		emit DonationTransferedToTheBeneficiary(block.timestamp, balance);
	}

	fallback() external payable {
    		totalDonationsSum = totalDonationsSum.add(msg.value);
    		totalDonationsNumber = totalDonationsNumber.add(1);
	}
}
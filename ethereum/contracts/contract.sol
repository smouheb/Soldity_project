// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {

    address[] public campaigns;

    function deployCampaigns(uint minimumContribution) public{
        address newCampaign = new Campaign(minimumContribution, msg.sender);
    }

    function getDeployedCampaign() public view returns(address[] memory){
        return campaigns;
    }
} 

contract Campaign {

    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;

    }

    Request[] public request;

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    mapping(address => bool) approvals;
    address[] public approversnbre;

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    constructor(uint minContribution, address creator) {

        manager = creator;
        minimumContribution = minContribution;
    }

    function contribute() public  payable {
        require(msg.value > minimumContribution, "Amount is to low");
        if(!approvers[msg.sender]){
            approversnbre.push(msg.sender);
        }
        approvers[msg.sender] = true;

    }

    function  createRequest(string memory description, uint value, address payable recipient) public restricted {

        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        request.push(newRequest);
    }

    function approveRequest(uint index) public {

        Request storage req = request[index];

        require(approvers[msg.sender], "Only contributors to this project can approve");
        require(!approvals[msg.sender], "You have already approved this request");
        require(!req.complete, "This request has already been finalized");
        approvals[msg.sender] = true;
        req.approvalCount++;

    } 

    function finalizeRequest(uint index) public payable restricted{
        Request storage requests = request[index];
        require(!requests.complete);
        //get the number of approvals
        uint countApprovals = requests.approvalCount;
        uint reqApprovers = approversnbre.length;
        // if > 50% then send money
        require(countApprovals > (reqApprovers/2));
        requests.recipient.transfer(requests.value);
        requests.complete = true;

    }

    function getNbreOfContributors() public view returns(uint nbre){
        return approversnbre.length;
    }

    function getAmntInContract() public view returns(uint amt){
        return address(this).balance;
    }

}

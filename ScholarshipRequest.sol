// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ScholarshipCall.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts-blob/master/constracts/utils/Address.sol";

contract ScholarshipRequest{
    /*using Address for address payable;
    
    event ServerResponseReceived(string response);
    */
    ScholarshipCall scholarshipCalls;

    //address private economicOracle;
    //bytes32 private jobId;
    //uint256 private fee;

    constructor(address _scholarshipCallsAddress){
        scholarshipCalls = ScholarshipCall(_scholarshipCallsAddress);
    
        /*
        setPublicChainLinkToken();
        oracle = 0x00000000000000000000000;
        jobId = "xxxxxxxxxxxxx";
        fee = 0.1 * 10 ** 18;*/
    }
    /*
    function interactWithServer(string memory requestData) public {
        string memory serverUrl = "https://localhost:3000/";
        bytes memory requestDataBytes = bytes(requestData);

        (bool success, bytes memory returnedData) = serverUrl.staticcall(abi.encodeWithSignature("makeHttpRequest(string)", requestDataBytes));

        if(success){
            string memory response = string(returnedData);
            emitServerResponseReceived(response);
        }
    }
    /*
    function requestDataFromServer() external {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.futfill.selector);
    
        request.add("get", "https://localhost:3000/get");
        request.add("path", "data");

        sendChainlinkRequestTo(economiOracle, request, fee);
    }

    function futfill(bytes32 _requestId, uint _externalData) public recordChainlinkFutfillment(_requestId){
        externalData = _externalData
;    }*/

    function getScholarshipCallRequirement(string memory name) public view returns (string memory, int32, string memory, int16, int32, int16){
        return scholarshipCalls.getScholarshipInfo(name);
    }
}
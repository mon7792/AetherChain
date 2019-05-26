pragma solidity ^0.5.0;

contract Meter {
  /*  Basic struct of reading*/
  struct Reading {
    uint muid;
    string mkeyhash;
    string reading;
    string timestamp;
    bool activated;
  }

  /*  Store Meter Count */
  uint public meterCount;

  /* Store the Meter Count */
  mapping (uint => Reading) public readingList;

  /* Store account has voted */
  mapping (address => bool) public validList;

  /* function validMeter(uint _muid, string memory _mhash) public {

    require(hashCompare(_mhash,readingList[_muid].mkeyhash) == true);
    validList[msg.sender] = true;
  }

  function hashCompare(Reading storage a, string memory b) internal returns (bool) {
    return keccak256(abi.encodePacked(_first.age, _first.name)) == keccak256(b);
} */
function getHash(uint _muid) private view returns (string memory){
  return readingList[_muid].mkeyhash;
}

function createAuthorizedMeter(uint _muid, string memory _hash, string memory _reading, string memory _timestamp, bool status) private {
  meterCount++;
  readingList[meterCount] = Reading(_muid,_hash,_reading,_timestamp,status);
}

constructor() public {
  createAuthorizedMeter(111, "hash1","30", "12:00:01",true);
}
}

pragma solidity ^0.5.0;

contract Meter {
  /*  Basic struct of reading*/
  struct Reading {
    uint muid;
    string mkeyhash;
    uint reading;
    string timestamp;
    bool activated;
  }

  /*  Store Meter Count */
  uint public meterCount;

  /* Store the Meter Count */
  mapping (uint => Reading) public readingList;

/* Returns the hash value based on the the muid  */
function getHash(uint _id) private view returns (string memory){
  return readingList[_id].mkeyhash;
}
function hashcheck(uint _id, string memory _hash) private returns (bool) {
  return  (keccak256(abi.encodePacked((_hash))) == keccak256(abi.encodePacked((getHash(_id)))) );
}

function writeMeter(uint _id, uint _muid, uint _reading,string memory _hash)public{
  require(hashcheck(_id, _hash));
  readingList[_id].reading += _reading;
}

function createAuthorizedMeter(uint _muid, string memory _hash, uint _reading, string memory _timestamp, bool status) private {
  meterCount++;
  readingList[meterCount] = Reading(_muid,_hash,_reading,_timestamp,status);
}

constructor() public {
  createAuthorizedMeter(111, "hash1",30, "12:00:01",true);
  createAuthorizedMeter(222, "hash2",30, "12:00:01",true);
  createAuthorizedMeter(333, "hash3",30, "12:00:01",true);
  createAuthorizedMeter(444, "hash4",30, "12:00:01",true);
}
}

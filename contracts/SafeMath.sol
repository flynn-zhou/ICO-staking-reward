// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract SafeMath {
    function add(uint a, uint b) external pure returns (uint c) {
        c = a + b;
        require(c > a);
    }

    function sub(uint a, uint b) external pure returns (uint c) {
        require(a > b);
        c = a - b;
    }

    function mul(uint a, uint b) external pure returns (uint c) {
        if (a == 0) return 0;
        require((c = a * b) / a == b);
    }

    function div(uint a, uint b) external pure returns (uint c, uint makeup) {
        makeup = 1e0;
        if (b == 0) return (0, 1e0);
        if (a >= b) {
            c = a / b;
        } else {
            for (uint i = 1; i <= 18; i++) {
                if (a * 10 ** i >= b) {
                    return ((a * 10 ** i) / b, 10 ** i);
                }
            }
        }
    }
}

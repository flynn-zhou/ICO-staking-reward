// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

pragma solidity ^0.8.0;

contract ERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    string public name;
    string public symbol;
    uint8 public decimals;

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function _mint(address to, uint256 amount) internal {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal {
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}

pragma solidity ^0.8.0;

contract TokenICO {
    address public owner;
    address public tokenAddress; //0xE5363f1b12023d5A402D551362746f684B5c6532

    uint256 public tokenSalePrice; //100000000000000

    uint256 public soldTokens;

    modifier OnlyOwner() {
        require(msg.sender == owner, "Only owner call");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function uodateToken(address _tokenAddress) external OnlyOwner {
        tokenAddress = _tokenAddress;
    }

    //0.0001 100,000,000,000,000
    //100000000000000
    //1000000000000000
    function uodateTokenSalePrice(uint _tokenSalePrice) external OnlyOwner {
        tokenSalePrice = _tokenSalePrice;
    }

    function _multiply(uint256 a, uint256 b) internal pure returns (uint c) {
        if (a == 0) {
            return 0;
        }
        require(a == 0 && (c = a * b) / a == b, "Unsafe mul");
    }

    // 100000000000000 * 10
    function buyToken(uint256 _tokenAmount) external payable {
        require(
            msg.value >= _multiply(_tokenAmount, tokenSalePrice),
            "Eth not enougth"
        );

        ERC20 token = ERC20(tokenAddress);
        require(
            _tokenAmount <= token.balanceOf(address(this)),
            "Not enougth ICO token"
        );

        require(
            token.transfer(msg.sender, _tokenAmount * 1e18),
            "Buy token transfer fail"
        );
        payable(owner).transfer(msg.value);

        soldTokens += _tokenAmount;
    }

    function getTokenDetails()
        external
        view
        returns (
            string memory name,
            string memory symbol,
            uint256 balance,
            uint256 supply,
            uint256 tokenPrice,
            address tokenAddr
        )
    {
        ERC20 token = ERC20(tokenAddress);

        return (
            token.name(),
            token.symbol(),
            token.totalSupply(),
            token.balanceOf(address(this)),
            tokenSalePrice,
            tokenAddress
        );
    }

    function withdrawAllTokens() external OnlyOwner {
        ERC20 token = ERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No token to withdraw");
        token.transfer(owner, balance);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract P2PTutoringPlatform {
    enum UserType { Tutor, Student }

    struct User {
        address userAddress;
        UserType userType;
        uint256 rating;
        uint256 sessionsCompleted;
    }

    struct Session {
        address tutor;
        address student;
        uint256 price;
        bool completed;
        bool paid;
    }

    mapping(address => User) public users;
    mapping(uint256 => Session) public sessions;
    uint256 public sessionCount;

    event UserRegistered(address indexed userAddress, UserType userType);
    event SessionCreated(uint256 indexed sessionId, address indexed tutor, address indexed student, uint256 price);
    event SessionCompleted(uint256 indexed sessionId);
    event PaymentMade(uint256 indexed sessionId, uint256 amount);
    event RatingUpdated(address indexed userAddress, uint256 newRating);

    modifier onlyTutor(address _tutor) {
        require(users[_tutor].userType == UserType.Tutor, "Not a tutor");
        _;
    }

    modifier onlyStudent(address _student) {
        require(users[_student].userType == UserType.Student, "Not a student");
        _;
    }

    function registerUser(UserType _userType) public {
        require(users[msg.sender].userAddress == address(0), "User already registered");
        users[msg.sender] = User(msg.sender, _userType, 0, 0);
        emit UserRegistered(msg.sender, _userType);
    }

    function createSession(address _tutor, uint256 _price) public onlyStudent(msg.sender) {
        require(users[_tutor].userType == UserType.Tutor, "Tutor not found");
        sessionCount++;
        sessions[sessionCount] = Session(_tutor, msg.sender, _price, false, false);
        emit SessionCreated(sessionCount, _tutor, msg.sender, _price);
    }

    function completeSession(uint256 _sessionId) public onlyTutor(msg.sender) {
        Session storage session = sessions[_sessionId];
        require(session.tutor == msg.sender, "Not the tutor of this session");
        require(!session.completed, "Session already completed");
        session.completed = true;
        emit SessionCompleted(_sessionId);
    }

    function makePayment(uint256 _sessionId) public payable {
        Session storage session = sessions[_sessionId];
        require(session.student == msg.sender, "Not the student of this session");
        require(session.completed, "Session not completed");
        require(!session.paid, "Payment already made");
        require(msg.value == session.price, "Incorrect payment amount");
        session.paid = true;
        payable(session.tutor).transfer(msg.value);
        emit PaymentMade(_sessionId, msg.value);
    }

    function rateUser(address _user, uint256 _rating) public {
        require(users[_user].userAddress != address(0), "User not found");
        User storage user = users[_user];
        user.rating = (user.rating * user.sessionsCompleted + _rating) / (user.sessionsCompleted + 1);
        user.sessionsCompleted++;
        emit RatingUpdated(_user, user.rating);
    }
}

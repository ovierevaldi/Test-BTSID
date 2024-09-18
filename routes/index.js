var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Secret key for JWT
const JWTSECRET = process.env.JWTSECRET;

// used hashed password to compare since not using database, the password for login is pass123
const users = [
  {username: 'ovierevaldi', email: 'revaldiovie3@gmail.com', password: '$2b$10$hRWQioSXZ4Cdx/C3Knx9i.K8e8Ca3cdoBl6nS4Be5ZH.RvymLdDcy'}
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Login Register. */
// Register endpoint (for testing purposes)
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
        success: false,
        message: 'Username, Email and Password are required.',
    });
}

  const hashedPassword = await bcrypt.hash(password, 10);
  // testing only
  console.log(hashedPassword)
  users.push({ email, username, password: hashedPassword });
  res.status(201).json({ message: 'User registered!'});
});

// Login Endpoint
router.post('/login', async function(req, res, next){
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and Password are required.',
        });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
        // Username not found / not registered
        return res.status(401).json({ message: 'Username not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('a')
        return res.status(401).json({ message: 'Wrong pass' });
    }

    // Create a token
    const token = jwt.sign({ username: user.username }, process.env.JWTSECRET, { expiresIn: '1h' });
    
    // Respond with token
    res.json({ token });
})




module.exports = router;

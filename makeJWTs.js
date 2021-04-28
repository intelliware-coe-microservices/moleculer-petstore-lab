const jwt = require('jsonwebtoken');
const privateKey = require('fs').readFileSync('private.key');

function makeJWT(sub, name, roles) {
	return jwt.sign({
		"sub": sub,
		"iss": "petstore.com",
		"name":name,
		"roles":roles,
	}, privateKey, {expiresIn: '1w'});
}

process.stdout.write('Alice (Admin, User): ' + makeJWT('12345', 'Alice', ['ADMIN', 'USER']));
process.stdout.write('\n');
process.stdout.write('\n');
process.stdout.write('Bob   	   (User): ' + makeJWT('67890', 'Bob', ['USER']));


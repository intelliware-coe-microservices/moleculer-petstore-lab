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

process.stdout.write('Alice (Roles -> [Admin, User]): ' + makeJWT('12345', 'Alice', ['ADMIN', 'USER']));
process.stdout.write('\n');
process.stdout.write('\n');
process.stdout.write('Bob (Roles -> [User]): ' + makeJWT('67890', 'Bob', ['USER']));
process.stdout.write('\n');
process.stdout.write('\n');
process.stdout.write('Malicious Mel (Roles -> []): ' + makeJWT('475832', 'Malicious Mel', []));


//emcc -lembind -o example.js example.cpp -s MODULARIZE=1

//emcc -l embind -o example.js example.cpp -s MODULARIZE=1 -Isrc  hello.cpp

const Module = require('./psychrometry.js'); // Replace with the correct path to the generated JavaScript file

Module().then(myModule => {
	const v1 = new myModule.VectorDouble();
	v1.push_back(101325);
	v1.push_back(30);
	v1.push_back(15);

	const v2 = new myModule.VectorString();
	v2.push_back("p");
	v2.push_back("tdb");
	v2.push_back("twb");
	
	console.log(myModule.to_str(v2, v1));
});

//emcc -lembind -o example.js example.cpp -s MODULARIZE=1

//emcc -l embind -o example.js example.cpp -s MODULARIZE=1 -Isrc  hello.cpp

const Module = require('./psychrometry.js'); // Replace with the correct path to the generated JavaScript file

Module().then(myModule => {
	const v1 = new myModule.VectorDouble();
	v1.push_back(1.1);
	v1.push_back(2.2);

	const v2 = new myModule.VectorDouble();
	v2.push_back(3.1);
	v2.push_back(4.2);
	//v2.push_back(5.2);

    const result = myModule.addVectors(v1, v2);
    
	console.log(result.size());
	console.log(myModule.sayhello());
});

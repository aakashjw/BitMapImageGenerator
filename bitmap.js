var ImageJS = require("imagejs");
var fetch = require('node-fetch');

//creating a white background image
var bitmap = new ImageJS.Bitmap({
    width: 128, height: 128,
    color: {r: 255, g: 255, b: 255, a: 255}
});

var count = 0;

var requirednumbers = 128 * 128 * 3 //for each rgb value
var requiredcount = Math.ceil(requirednumbers / 10000) //limit for random.org

// Since the limit for random.org integer generator is 10000 I have to divide it into chunks of 10,000. 
// Or i would have generated 128*128 rgbs at one go.
var arry = []
var finalarry = []

fetchRandomNumbers();
	function fetchRandomNumbers(){
		if(count == requiredcount){
			drawImage();
			return
		}
		fetch('https://www.random.org/integers/?num=10000&min=0&max=255&col=1&base=10&format=plain&rnd=new')
	    .then(function(res) {
	        return res.text();
	    }).then(function(body) {
	    	var temp = body.split('\n');
	    	for(var i = 0; i < temp.length; i++){
	    		arry.push(Number(temp[i]))
	    	}
	       count = count+1; 
	       fetchRandomNumbers();
	    });	
	}


// write to a jpg file, quality 75 (default is 90)
function drawImage(){

	for(var i=0;i<arry.length;i+=3){
    	var temp = [arry[i],arry[i+1],arry[i+2]]
    	finalarry.push(temp)
    }
    
    var x = 0;
    var y = 0;
    for(var i=0,k=0;i<finalarry.length;i++,k++){
 		if(k == 127){
 			k = 0;
 			y = y+1 
 		}
 		x = i%128;
 		var obj = {r:finalarry[i][0], g:finalarry[i][1], b:finalarry[i][2]};
 		bitmap.setPixel(x,y, obj);
	}

	return bitmap.writeFile("image.jpg", { quality:75 })
    .then(function() {
        // bitmap has been saved
    });

}

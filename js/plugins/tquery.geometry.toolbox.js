/**
 * @fileOverview Plugins for tQuery.Geometry: tool box to play with geometry
*/

(function(){	// TODO why is there a closure here ?

//////////////////////////////////////////////////////////////////////////////////
//		Size functions							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Geometry.register('computeAll', function(){
	this.each(function(tGeometry){
		tGeometry.computeBoundingBox();
		tGeometry.computeCentroids();
		tGeometry.computeFaceNormals();
		tGeometry.computeVertexNormals();
		//tGeometry.computeTangents();
	});

	// return this, to get chained API	
	return this;
});

/**
 * zoom a geometry
 *
 * @name zoom
 * @methodOf tQuery.Geometry
*/
tQuery.Geometry.register('scaleBy', function(vector3){
	// handle parameters
	if( typeof vector3 === "number" && arguments.length === 1 ){
		vector3	= new THREE.Vector3(vector3, vector3, vector3);
	}else if( typeof vector3 === "number" && arguments.length === 3 ){
		vector3	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(vector3 instanceof THREE.Vector3, "Geometry.vector3 parameter error");

	// change all geometry.vertices
	this.each(function(geometry){
		for(var i = 0; i < geometry.vertices.length; i++) {
			var vertex	= geometry.vertices[i];
			vertex.multiplySelf(vector3); 
		}
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	})

	// return this, to get chained API	
	return this;
});

tQuery.Geometry.register('size', function(){
	// only on zero-or-one element
	console.assert(this.length <= 1)
	// if no element, return undefined
	if( this.length === 0 )	return undefined

	// else measure the size of the element
	var geometry	= this.get(0);
	// compute middle
	var size= new THREE.Vector3()
	size.x	= geometry.boundingBox.max.x - geometry.boundingBox.min.x;
	size.y	= geometry.boundingBox.max.y - geometry.boundingBox.min.y;
	size.z	= geometry.boundingBox.max.z - geometry.boundingBox.min.z;

	// return the just computed middle
	return size;	
});

/**
*/
tQuery.Geometry.register('normalize', function(){
	// change all geometry.vertices
	this.each(function(geometry){
		var node	= tQuery(geometry);
		var size	= node.size();
		if( size.x >= size.y && size.x >= size.z ){
			node.zoom(1/size.x);
		}else if( size.y >= size.x && size.y >= size.z ){
			node.zoom(1/size.y);
		}else{
			node.zoom(1/size.z);
		}
	});
	// return this, to get chained API	
	return this;
});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////


tQuery.Geometry.register('middlePoint', function(){
	// only on zero-or-one element
	console.assert(this.length <= 1)
	// if no element, return undegined
	if( this.length === 0 )	return undefined
	// else measure the size of the element
	var geometry	= this.get(0);
	// compute middle
	var middle	= new THREE.Vector3()
	middle.x	= ( geometry.boundingBox.max.x + geometry.boundingBox.min.x ) / 2;
	middle.y	= ( geometry.boundingBox.max.y + geometry.boundingBox.min.y ) / 2;
	middle.z	= ( geometry.boundingBox.max.z + geometry.boundingBox.min.z ) / 2;

	// return the just computed middle
	return middle;
});

//////////////////////////////////////////////////////////////////////////////////
//		move functions							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Geometry.register('translate', function(delta){
	// handle parameters
	if( typeof delta === "number" && arguments.length === 3 ){
		delta	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(delta instanceof THREE.Vector3, "Geometry.translate parameter error");

	// change all geometry.vertices
	this.each(function(geometry){
		// change all geometry.vertices
		for(var i = 0; i < geometry.vertices.length; i++) {
			var vertex	= geometry.vertices[i];
			vertex.addSelf(delta); 
		}
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	})

	// return this, to get chained API	
	return this;
});

tQuery.Geometry.register('rotate', function(angles, order){
	// handle parameters
	if( typeof angles === "number" && arguments.length === 3 ){
		angles	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(angles instanceof THREE.Vector3, "Geometry.rotate parameter error");

	// set default rotation order if needed
	order	= order	|| 'XYZ';
	// compute transformation matrix
	var matrix	= new THREE.Matrix4();
	matrix.setRotationFromEuler(angles, order);

	// change all geometry.vertices
	this.each(function(geometry){
		// apply the matrix
		geometry.applyMatrix( matrix );
	
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	});

	// return this, to get chained API	
	return this;
});

/**
*/
tQuery.Geometry.register('center', function(noX, noY, noZ){
	// change all geometry.vertices
	this.each(function(tGeometry){
		var geometry	= tQuery(tGeometry);
		// compute delta
		var delta 	= geometry.middlePoint().negate();
		if( noX )	delta.x	= 0;
		if( noY )	delta.y	= 0;
		if( noZ )	delta.z	= 0;

		return geometry.translate(delta)
	});
	// return this, to get chained API	
	return this;
});

/**
 * Smooth the geometry using catmull-clark
 *
 * @param {Number} subdivision the number of subdivision to do
*/
tQuery.Geometry.register('smooth', function(subdivision){
	// init the modifier
	var modifier	= new THREE.SubdivisionModifier( subdivision );
	// apply it to each geometry
	this.each(function(geometry){
		// apply it
		modifier.modify( geometry )
	
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	});
	// return this, to get chained API	
	return this;
});

// some shortcuts
tQuery.Geometry.register('translateX'	, function(delta){ return this.translate(delta, 0, 0);	});
tQuery.Geometry.register('translateY'	, function(delta){ return this.translate(0, delta, 0);	});
tQuery.Geometry.register('translateZ'	, function(delta){ return this.translate(0, 0, delta);	});
tQuery.Geometry.register('rotateX'	, function(angle){ return this.rotate(angle, 0, 0);	});
tQuery.Geometry.register('rotateY'	, function(angle){ return this.rotate(0, angle, 0);	});
tQuery.Geometry.register('rotateZ'	, function(angle){ return this.rotate(0, 0, angle);	});
tQuery.Geometry.register('scaleXBy'	, function(ratio){ return this.scaleBy(ratio, 1, 1);	});
tQuery.Geometry.register('scaleYBy'	, function(ratio){ return this.scaleBy(1, ratio, 1);	});
tQuery.Geometry.register('scaleZBy'	, function(ratio){ return this.scaleBy(1, 1, ratio);	});

// backward compatibility
tQuery.Geometry.register('zoom'		, function(value){return this.scaleBy(value);		});
tQuery.Geometry.register('zoomX'	, function(ratio){ return this.zoom(ratio, 1, 1);	});
tQuery.Geometry.register('zoomY'	, function(ratio){ return this.zoom(1, ratio, 1);	});
tQuery.Geometry.register('zoomZ'	, function(ratio){ return this.zoom(1, 1, ratio);	});


})();	// closure function end

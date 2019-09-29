
//	VertexDirt plug-in for Unity
//	Copyright 2014-2016, Zoltan Farago, All rights reserved.

#pragma strict

class VDColorHandlerBase extends MonoBehaviour 
{
	@HideInInspector
	var colors : Color32[];
	@HideInInspector
	var tempColors : Color32[];
	@HideInInspector
	var coloredMesh : Mesh;
	var originalMesh : Mesh;
	//var inited : boolean = false;	
	//
	function Refresh() 
	{
		
	}
}
/* 
	VertexDirt plug-in for Unity
	Copyright 2014-2016, Zoltan Farago, All rights reserved.
*/
@script ExecuteInEditMode()
var tex : Texture2D;
var lum : Color32[];

function Awake()
{
	 tex = new Texture2D (VertexDirt.sampleWidth, VertexDirt.sampleHeight, TextureFormat.RGB24, true);
}

function OnPostRender () 
{	
	tex.ReadPixels (Rect(0, 0, VertexDirt.sampleWidth, VertexDirt.sampleHeight), 0, 0);
	lum = tex.GetPixels32(tex.mipmapCount-1);
	//
	//var bytes = tex.EncodeToPNG();
	// System.IO.File.WriteAllBytes(Application.dataPath + "/../saved/SavedScreen"+VertexDirt.vertexSample.index+".png", bytes);	
	//
	VertexDirt.SetColorSample(lum[0]);
}

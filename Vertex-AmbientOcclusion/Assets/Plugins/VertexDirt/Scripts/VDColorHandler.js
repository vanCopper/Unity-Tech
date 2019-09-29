/* 
	VertexDirt plug-in for Unity
	Copyright 2014-2016, Zoltan Farago, All rights reserved.
*/
#pragma strict
@ExecuteInEditMode()

class VDColorHandler extends VDColorHandlerBase 
{
	@HideInInspector
	var blendModeIndex : int = 0;

	function Awake() 
	{
		if (Application.isPlaying) 
		{
			var mf : MeshFilter = GetComponent.<MeshFilter>();
			SetMesh();
			mf.mesh.colors32 = colors;
		}
	}	
	function Update() 
	{
		if (Application.isEditor && !Application.isPlaying) 
		{
			SetMesh();
		}
	}
	function SetColors()
	{
		var mf : MeshFilter = GetComponent.<MeshFilter>();
		coloredMesh.colors32 = colors;
		mf.mesh = coloredMesh;
	}
	function SetMesh() {
		var mf : MeshFilter = GetComponent.<MeshFilter>();
		if (!GetComponent.<MeshFilter>().sharedMesh) 
		{
			//Debug.Log("1");
			GetComponent.<MeshFilter>().sharedMesh = originalMesh;
		}
		if (!coloredMesh && Application.isEditor && !Application.isPlaying) 
		{
			//Debug.Log("2");
			originalMesh = mf.sharedMesh;
			coloredMesh = Mesh.Instantiate(mf.sharedMesh) as Mesh;  //make a deep copy
			coloredMesh.name = mf.sharedMesh.name;
			SetColors();
		}		
		if (colors != tempColors && Application.isEditor && !Application.isPlaying)
		{
			//Debug.Log("3");			
			tempColors = colors;
			SetColors();
		}
		//inited = true;
	}
	function Refresh() 
	{
		var meshFilter : MeshFilter = gameObject.GetComponent(MeshFilter);
		//DestroyImmediate(coloredMesh);
		coloredMesh = Instantiate(originalMesh);
		meshFilter.mesh = coloredMesh;
		if (originalMesh.colors) 
		{
			for (var i : int = 0; i<colors.Length; i++)
			{
				if (originalMesh.colors.Length > i) 
				{
					// multiply
					if (blendModeIndex == 1)
					{
						colors[i] = colors[i] * originalMesh.colors[i];	
					}
				}
			}
		}
		coloredMesh.colors32 = colors;
		gameObject.GetComponent(MeshFilter).mesh = coloredMesh;			
	}
	function OnDisable() 
	{
		gameObject.GetComponent(MeshFilter).mesh = originalMesh;
	}
	function OnEnable() 
	{
		var meshFilter : MeshFilter = gameObject.GetComponent(MeshFilter);
		if (!originalMesh) 
		{
			originalMesh = meshFilter.sharedMesh;
		}	
		if (coloredMesh) 
		{
			meshFilter.mesh = coloredMesh;
		}
	}
}
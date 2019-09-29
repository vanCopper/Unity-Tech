
//	VertexDirt plug-in for Unity
//	Copyright 2014-2016, Zoltan Farago, All rights reserved.
	
#pragma strict
#pragma downcast 

class VertexDirtSettingsStruct
{
	// the shader used on occluders. If not exist or empty, objects keeps their shaders during bake
	var occluderShader : String;
	//	clip planes of the sampling camera.
	var samplingBias : float = 0.01;
	var samplingDistance : float = 0.5;
	//	The FOV of the sampling camera. Please note that this value normally should be between 100-160.
	var samplingAngle : float = 90.0;
	//	Enable to smoothing out hard edges. Basically just averages the normals of the vertices in the same position.
	var edgeSmooth : boolean = false;
	//	Set true if you want to render the inside of the objects. set true to render thickness.
	var invertNormals : boolean = false;
	//	The range of edge smoothing. The normals of vertices closer than this value will be averaged.
	var edgeSmoothBias : float = 0.01;
	//	sampling camera backdrop. 
	var skyMode : CameraClearFlags = CameraClearFlags.SolidColor;
	//	bake the background colour/cubeMap only
	var disableOccluders : boolean = false;
	//	The colour of the Sky.
	var customSkyColor : Color = Color.white;
	//	Colour tint for the occluders. This property is designed for the VDOccluder shader.
	var customShadowColor : Color = Color.black;
	//	enable custom sky color
	var useCustomSkyColor : boolean = true;
	//	enable custom shadow color
	var useCustomShadowColor : boolean = true;
	//	enable custom shadow color
	var useSkyCube : boolean = false;	
	//	The cubeMap of the sampling camera's sky.
	var skyCube : Material;
	// blendmode index
	var blendModeIndex : int = 0;
}

//	Main Vertex dirt class. VertexDirt is an Ambient Occlusion baking plug-in.
static class VertexDirt 
{
	// private variables for mesh merging and vertex sampling
	private var v : Vector3[];
	private var n : Vector3[];
	private var c : Color32[];
	 
	//	public variable, but this is used by the baking.
	var vertexSample : VertexSample = new VertexSample();
	//	resolution of the sample. 16 is fine and fast. 64 gives better quality but slower.
	var sampleWidth : int = 16;
	var sampleHeight : int = 16;
	// not implemented yet: vertexdirt baking mode: 0-Nothing, 1-AmbOcc, 2-ClearWithSky, 3-Thickness
	var rgbBakingMode : int = 0;
	var alphaBakingMode : int = 0;
	//
	var settings : VertexDirtSettingsStruct = new VertexDirtSettingsStruct();
	
	//	Main function for vertex baking. The Object[] array will be used.
    function Dirt(sels : Transform[]) 
	{
		#if UNITY_EDITOR
		var tempTime : float = EditorApplication.timeSinceStartup;
		EditorUtility.DisplayProgressBar("VertexDirt baking", "Preparing" , 0.0);
		#endif
 		if (sels && sels.Length > 0) 
		{
			//	vertex camera
			var camGO : GameObject = new GameObject("VDSamplerCamera"); 
			var cam : Camera = camGO.AddComponent(Camera);
			var ren : RenderTexture = new RenderTexture(sampleWidth, sampleHeight, 16, RenderTextureFormat.ARGB32);
			camGO.AddComponent.<VDSampler>();
			//	faster sampling, but need pro licence on 4.x
			cam.targetTexture = ren;
			#if Unity_4_0 || Unity_4_1 || Unity_4_2 || Unity_4_3 || Unity_4_4 || Unity_4_5 || Unity_4_6 || Unity_4_7
			if (!Application.HasProLicense) { cam.targetTexture = null;}
			#endif
			cam.renderingPath = RenderingPath.Forward;
			cam.pixelRect = Rect(0,0,sampleWidth, sampleHeight);
			cam.aspect = 1.0;	
			cam.nearClipPlane = 0.001;
			cam.farClipPlane = 100;
			cam.fieldOfView = Mathf.Clamp ( settings.samplingAngle, 5, 160 );
			cam.clearFlags = settings.skyMode;
			cam.backgroundColor = settings.useCustomSkyColor ? settings.customSkyColor : Color.white;
			cam.enabled = false;
			var tempSkybox : Material = RenderSettings.skybox;
			if (settings.skyMode == CameraClearFlags.Skybox) { RenderSettings.skybox = settings.skyCube; }
			UpdateShaderVariables();
			cam.SetReplacementShader(Shader.Find(settings.occluderShader), settings.disableOccluders ? "ibl-only" : "");
			var pnum : int = 0;
			
			for (var t : int = 0; t<sels.Length; t++) 
			{
				if (sels[t].gameObject.GetComponent(MeshFilter)) 
				{
					PrepareVertices(sels[t]);
					PrepareColors();
					SmoothVertices();
					CalcColors(camGO, cam);
					ApplyColors(sels[t]);
					pnum += v.Length;
					#if UNITY_EDITOR
					if (EditorUtility.DisplayCancelableProgressBar("VertexDirt baking", "Processing "+(t+1)+" of "+sels.Length+" objects ("+pnum+" vertices processed)" , 1.0*(t+1)*(1.0/sels.Length))) 
					{
						break;
					}
					#endif
				}
			}
			RenderSettings.skybox = tempSkybox;
			cam.targetTexture = null;
			GameObject.DestroyImmediate(ren);
			GameObject.DestroyImmediate(camGO);
			var handlers : VDColorHandlerBase[] = UnityEngine.Object.FindObjectsOfType(VDColorHandlerBase);

			for (var handler : VDColorHandlerBase in handlers) 
			{
				if (handler.originalMesh && !handler.coloredMesh) 
				{
					handler.coloredMesh = UnityEngine.Object.Instantiate(handler.originalMesh);
					handler.gameObject.GetComponent(MeshFilter).mesh = handler.coloredMesh;
				}
			}
		}
		#if UNITY_EDITOR
		EditorUtility.ClearProgressBar();
		//EditorUtility.DisplayDialog("VertexDirt baking", "Baking of "+sels.Length+" objects ("+pnum+" vertices)\nis finished in "+Mathf.RoundToInt(EditorApplication.timeSinceStartup - tempTime)+" seconds.", "OK");
		Debug.Log ("Baking of "+sels.Length+" objects ("+pnum+" vertices) finished in "+Mathf.RoundToInt(EditorApplication.timeSinceStartup - tempTime)+" seconds.");
		#endif
    }

	//	function to update shader properties
	function UpdateShaderVariables() 
	{
		Shader.SetGlobalColor("_VDSkyColor", settings.useCustomSkyColor ? settings.customSkyColor : Color.black);
		Shader.SetGlobalColor("_VDOccluderColor", settings.useCustomShadowColor ? settings.customShadowColor : Color.black);
		Shader.SetGlobalFloat("_VDsamplingDistance", settings.samplingDistance);
	}

	private function PrepareVertices(go : Transform) 
	{
		var vertexCount : int;
		v = new Vector3[0];
		n = new Vector3[0];
		c = new Color32[0];
		
		if (!go.gameObject.GetComponent(VDColorHandlerBase)) 
		{
			go.gameObject.AddComponent(VDColorHandler);
		}
		go.gameObject.GetComponent(VDColorHandler).blendModeIndex = VertexDirt.settings.blendModeIndex;
		var v0 = go.gameObject.GetComponent(MeshFilter).sharedMesh.vertices;
		var n0 = go.gameObject.GetComponent(MeshFilter).sharedMesh.normals;
				
		for (var t : int = 0; t < v0.Length; t++) 
		{
			v0[t] = go.TransformPoint(v0[t]);
			n0[t] = Vector3.Normalize(go.TransformDirection(n0[t]));
		}
		vertexCount += v0.Length;
		v = MergeVector3 (v, v0);
		n = MergeVector3 (n, n0);
	}
	
	function PrepareColors() 
	{
		c = new Color32[v.length];			
	}

	private function SmoothVertices() 
	{
		if (settings.edgeSmooth) 
		{
			for (var a = 0; a < v.length; a++) 
			{
				var tempV : int[] = new int[0];
				tempV += [a];
				for (var d = a; d < v.length; d++) 
				{
					if (Vector3.Distance(v[a],v[d]) < settings.edgeSmoothBias) 
					{
						tempV +=[d];
					}
				}
				var tempSumN : Vector3 = Vector3.zero;
				for (var dd : int = 0; dd<tempV.Length; dd++)
				{
					tempSumN += n[tempV[dd]];
				}
				tempSumN /= tempV.Length*1.0;
				for (var nn : int = 0; nn<tempV.Length; nn++)
				{
					n[tempV[nn]] = tempSumN;
				}
			}
			for (var k : int = 0; k <c.length; k++) 
			{
				c[k] = Color32 (255,255,255,255);
			}
		}
	}
	
	private function CalcColors(camGO : GameObject, cam : Camera) 
	{	
		for (var vv : int = 0; vv<v.Length; vv++) 
		{
			if (settings.invertNormals) 
			{
				camGO.transform.position = v[vv]-n[vv]*settings.samplingBias;
				camGO.transform.LookAt(v[vv] - n[vv]);
			}
			else 
			{
				camGO.transform.position = v[vv]+n[vv]*settings.samplingBias;
				camGO.transform.LookAt(v[vv] + n[vv]);
			}
			vertexSample.index = vv;
			vertexSample.isCalulated = false;
			cam.Render();
			while (!vertexSample.isCalulated) {}
			c[vv] = vertexSample.color; // * Color(lum,lum,lum,1);
		}
	}
	
	function SetColorSample(c : Color32) 
	{
		vertexSample.color = c;
		vertexSample.isCalulated = true;
	}

 	private function ApplyColors(go : Transform) 
	{
		var count : int = 0;
		var tc : Color32[] = new Color32[go.gameObject.GetComponent(VDColorHandlerBase).originalMesh.vertices.Length];	
		for (var c0 : int = 0; c0 <go.gameObject.GetComponent(VDColorHandlerBase).originalMesh.vertices.Length; c0++) 
		{
			tc[c0] = c[count];
			count++;
		}
		go.gameObject.GetComponent(VDColorHandlerBase).colors = tc;
		go.gameObject.GetComponent(VDColorHandlerBase).Refresh();
	}
	
	private function MergeVector3 (v1 : Vector3[], v2 : Vector3[]) : Vector3[] 
	{
		var v3 = new Vector3[v1.length + v2.length];
		System.Array.Copy (v1, v3, v1.length);
		System.Array.Copy (v2, 0, v3, v1.length, v2.length);
		return v3;	
	}
}

//	Class for passing samples from sampler camera to the VertexDirt class. For internal use only
class VertexSample 
{
	var color : Color32 = Color32(255,255,255,255);
	var index : int = 0;
	var isCalulated : boolean = false;
}
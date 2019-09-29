/* 
	VertexDirt plug-in for Unity
	Copyright 2014-2016, Zoltan Farago, All rights reserved.
*/
class VertexDirtWindow extends EditorWindow 
{
	static var window : VertexDirtWindow;
	static var tempTime : float;
	static var blendModes : String[] = ["Off (Override)","Multiply"];
	@MenuItem ("Tools/Zololgo/VertexDirt bake window", false, 10)
	static function ShowWindow () 
	{
		if (!window)
		{
			window = ScriptableObject.CreateInstance.<VertexDirtWindow>();
			window.position = Rect(100,100,260,430);
			window.minSize = Vector2 (260,430);
			window.maxSize = Vector2 (260,430);
			#if UNITY_5_0 || UNITY_5_1 || UNITY_5_2 || UNITY_5_3 || UNITY_5_4 || UNITY_5_5
				window.titleContent = GUIContent("VertexDirt Control Panel");
			#else 
				window.title = "VertexDirt Control Panel";
			#endif
			window.ShowUtility();
			VertexDirt.settings.occluderShader = "Hidden/VD-AMBIENTOCCLUSION";
		}
	}
    function OnGUI() 
	{
		// GUILayout.Space(10);
		// GUILayout.BeginHorizontal();
			// GUILayout.Label ("[RGB] bake mode", GUILayout.Width(120));
			// bakingModeIndex = EditorGUILayout.Popup(bakingModeIndex, bakingModes);	
		// GUILayout.EndHorizontal();					
		// GUILayout.Space(5);
		// GUILayout.BeginHorizontal();
			// GUILayout.Label ("[Alpha] bake mode", GUILayout.Width(120));
			// bakingModeIndex = EditorGUILayout.Popup(bakingModeIndex, bakingModes);	
		// GUILayout.EndHorizontal();	

		GUILayout.Space(5);
		GUILayout.Label ("Occlusion distance");
		VertexDirt.settings.samplingDistance = EditorGUILayout.Slider(VertexDirt.settings.samplingDistance,0.1, 100.0);
		//
		GUILayout.Space(5);
		GUILayout.Label ("Sampling angle");
		VertexDirt.settings.samplingAngle = EditorGUILayout.Slider(VertexDirt.settings.samplingAngle,45, 135);
		//
		//GUILayout.Space(5);
		//GUILayout.Label ("Sampling bias");
		//VertexDirt.settings.samplingBias = EditorGUILayout.Slider(VertexDirt.settings.samplingBias,0.00,0.1);
		//
		GUILayout.Space(20);
		//
		GUILayout.BeginHorizontal();
			GUILayout.Label ("Blend to existing colors", GUILayout.Width(150));
			VertexDirt.settings.blendModeIndex = EditorGUILayout.Popup(VertexDirt.settings.blendModeIndex, blendModes);	
		GUILayout.EndHorizontal();	
		GUILayout.Space(20);
		//
		GUILayout.BeginHorizontal();
			VertexDirt.settings.useCustomShadowColor = GUILayout.Toggle(VertexDirt.settings.useCustomShadowColor, "",GUILayout.Width(20));
			GUILayout.Label ("Custom shadow color", GUILayout.Width(140));
			VertexDirt.settings.customShadowColor = EditorGUILayout.ColorField(VertexDirt.settings.customShadowColor);
		GUILayout.EndHorizontal();		
		GUILayout.Space(5);
		GUILayout.BeginHorizontal();
			VertexDirt.settings.useCustomSkyColor = GUILayout.Toggle(VertexDirt.settings.useCustomSkyColor, "",GUILayout.Width(20));
			GUILayout.Label ("Custom sky color", GUILayout.Width(140));
			VertexDirt.settings.customSkyColor = EditorGUILayout.ColorField(VertexDirt.settings.customSkyColor);
		GUILayout.EndHorizontal();
		GUILayout.Space(5);
		GUILayout.BeginHorizontal();
			VertexDirt.settings.edgeSmooth = GUILayout.Toggle(VertexDirt.settings.edgeSmooth, "",GUILayout.Width(20));
			//GUILayout.FlexibleSpace();
			GUILayout.Label ("Average hard edges");
		GUILayout.EndHorizontal();

		if (GUI.Button(Rect(133,this.position.height-75,117,20),"Online manual") ) {
			Application.OpenURL ("http://zololgo.com/downloads/vertexdirt_manual.pdf");
		}		
 		if (Selection.gameObjects) 
		{
			if (GUI.Button(Rect(10,this.position.height-50,240,40),"Bake") ) 
			{
				VertexDirt.settings.occluderShader = "Hidden/VD-AMBIENTOCCLUSION";
				VertexDirt.Dirt(Selection.GetTransforms(SelectionMode.Deep));
			}
		}
    }
}
/* 
	VertexDirt plug-in for Unity
	Copyright 2014-2015, Zoltan Farago, All rights reserved.
*/
class VDSaveVertexColoredMeshes extends EditorWindow {

	private var path : String = "Plugins/VertexDirt/Saved meshes";
	static var window : VDSaveVertexColoredMeshes;
	
	@MenuItem("Tools/Zololgo/VertexDirt save meshes", false, 20)
    
	static function Init() {
	
		if (!window){
			window = ScriptableObject.CreateInstance.<VDSaveVertexColoredMeshes>();
			window.position = Rect(200,200, 640,140);
			window.minSize = Vector2 (640,140);
			window.maxSize = Vector2 (640,140);
			#if UNITY_5_0 || UNITY_5_1 || UNITY_5_2 || UNITY_5_3 || UNITY_5_4 || UNITY_5_5
				window.titleContent = GUIContent("VertexDirt save meshes");
			#else 
				window.title = "VertexDirt save meshes";
			#endif
			window.ShowUtility();
		}
		
    }
     
    function OnGUI() {
	
		GUILayout.Label("This tool collects the sharedMeshes of the Selection's Mesh Filter components, and saves them to .asset files.");
		GUILayout.Label("Then you can use the saved meshes with the generated colors without the need of VertexDirt's ColorHandler.");
		GUILayout.Label("");
		GUILayout.Label("Select single GameObject.");
		path = EditorGUILayout.TextField("Asset path for saving: ", path);
		if (GUILayout.Button("Save meshes of children.", GUILayout.Height(40))) {

			//Debug.Log (GetPathName(Selection.activeTransform, ""));
		
			var gos : Transform[] = Selection.activeTransform.GetComponentsInChildren.<Transform>(); 
		
 			for (var t : Transform in gos) {
			
				if (t.gameObject.GetComponent.<VDColorHandlerBase>() && t.gameObject.GetComponent.<MeshFilter>()) {
				
					try {
					
						AssetDatabase.CreateAsset( 
						
							t.gameObject.GetComponent.<MeshFilter>().sharedMesh, "Assets/"+path+"/"+GetPathName(t, "") +".asset" 
							
						);
						
					}
					catch(e : UnityException) {
					
						Debug.Log ("This asset already saved. If you have multiple gameobjects at the same hierarchy and with the same name, please give them uniqe names.");
					
					}
						
					AssetDatabase.SaveAssets();
					t.gameObject.GetComponent.<VDColorHandlerBase>().coloredMesh =
						t.gameObject.GetComponent.<MeshFilter>().sharedMesh;
				
				}
				
			}

			AssetDatabase.Refresh();
			
		}
		
		Repaint();
		
	}
	
	function GetPathName( t : Transform, s : String) : String {
	
		s = t.name + s;
	
		if (t.parent != null) {
			s = "--" + s;
			s = GetPathName(t.parent, s);
			
		}
			
		return s;
	
	}
	
}

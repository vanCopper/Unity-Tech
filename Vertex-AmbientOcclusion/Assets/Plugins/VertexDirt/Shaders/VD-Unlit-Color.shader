
Shader "VD Vertex Color/Unlit Tint only" {

	Properties {
	
		_Color ("Tint Color", Color) = (1,1,1,1)

	}
	
	SubShader {
		
		Tags { "RenderType"="Opaque" }
				
		Pass {
		
			Lighting Off
			Colormaterial Emission
			
			SetTexture [_] {
			
				constantcolor [_Color]
				Combine primary * constant 
				
			} 
			
		}	
				
	}
	
}

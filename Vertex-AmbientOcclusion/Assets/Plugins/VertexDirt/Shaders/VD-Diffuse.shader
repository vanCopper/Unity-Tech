
Shader "VD Vertex Color/Diffuse" {

	Properties {
	
		_Color ("Main Color", Color) = (1,1,1,1)
		_MainTex ("Base (RGB)", 2D) = "white" {}
	
	}
	
	SubShader {
	
		Tags { "RenderType"="Opaque" }
		LOD 200

		CGPROGRAM
	
		#pragma surface surf Standard vertex:vert
		sampler2D _MainTex;
		half4 _Color;

		struct Input {
		
			half2 uv_MainTex;
			half4 color;
			
		};

		void vert (inout appdata_full v, out Input o) { 
		
			UNITY_INITIALIZE_OUTPUT(Input,o);
			o.color = v.color * _Color; 
			
		}
		
		void surf (Input IN, inout SurfaceOutputStandard o) {
		
			half4 t = tex2D(_MainTex, IN.uv_MainTex);
			o.Albedo = t.rgb * IN.color.rgb;
			o.Alpha = t.a;
			
		}
		
		ENDCG
		
	}

	Fallback "VertexLit"
	
}

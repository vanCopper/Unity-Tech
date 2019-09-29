
Shader "VD Vertex Color/Specular" {

	Properties {
	
		_Color ("Main Color", Color) = (1,1,1,1)
		_SpecColor ("Specular Color", Color) = (0.5, 0.5, 0.5, 1)
		_Shininess ("Shininess", Range (0.03, 1)) = 0.078125
		_MainTex ("Base (RGB) Gloss (A)", 2D) = "white" {}
	
	}
	
	SubShader {
	
		Tags { "RenderType"="Opaque" }
		LOD 300

		CGPROGRAM
	
		#pragma surface surf BlinnPhong vertex:vert addshadow
		sampler2D _MainTex;
		half4 _Color;
		half _Shininess;

		struct Input {
		
			half2 uv_MainTex;
			half4 color;
			
		};

		void vert (inout appdata_full v, out Input o) { 
		
			UNITY_INITIALIZE_OUTPUT(Input,o);
			o.color = v.color * _Color; 
			
		}
		
		void surf (Input IN, inout SurfaceOutput o) {
		
			half4 t = tex2D(_MainTex, IN.uv_MainTex);
			o.Albedo = t.rgb * IN.color.rgb;
			o.Gloss = t.a;
			o.Specular = _Shininess;
			o.Alpha = t.a;
			
		}
		
		ENDCG
		
	}

	Fallback "Vertexlit"
	
}



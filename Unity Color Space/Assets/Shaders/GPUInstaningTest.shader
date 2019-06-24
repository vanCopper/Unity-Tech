Shader "Copper/GPUInstaningTest"
{
    Properties
    {
       
    }

    SubShader
    {
        Tags { "RenderPipeline" = "LightweightPipeline" "RenderType" = "Opaque" "Queue" = "Geometry" "DisableBatching" = "True" }
        Cull back
        
        Pass
        {
            Tags{"LightMode" = "LightweightForward"}

            Name "Base"
            Blend One Zero
            ZWrite On
            ZTest LEqual
            Offset 0,0
            ColorMask RGBA
            
            HLSLPROGRAM
            #pragma prefer_hlslcc gles
            #pragma exclude_renderers d3d11_9x
            #pragma target 3.0

            #pragma multi_compile_fog
            #pragma multi_compile_instancing

            #pragma vertex vert
            #pragma fragment frag
            
            //#define UNITY_DONT_INSTANCE_OBJECT_MATRICES
            #define UNITY_MATRIX_M unity_ObjectToWorld
             
            //#include "Packages/com.unity.render-pipelines.core/ShaderLibrary/UnityInstancing.hlsl"
            #include "Packages/com.unity.render-pipelines.lightweight/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.lightweight/ShaderLibrary/Lighting.hlsl"

            struct VertexInput
            {
                half4 vertex    : POSITION;
                half3 normal    : NORMAL;
                half4 tangent   : TANGENT;
                half4 texcoord  : TEXCOORD0;
                half4 texcoord1 : TEXCOORD1;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct VertexOutput
            {
                half4 positionCS    : SV_POSITION;
                half3 normalOS   : TEXCOORD1;    //xy: uv, z: fogFactor
                //half4 uvRotator   : TEXCOORD2;    //Rotate 45 degrees xy:Anticlockwise, zw:Clockwise
                //half2 weights         : TEXCOORD3;    //x: Anticlockwise weight, y: Clockwise weight.
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            VertexOutput vert ( VertexInput v )
            {
                VertexOutput o;
                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_TRANSFER_INSTANCE_ID(v, o);
                //Billboard rotation
                o.positionCS = TransformObjectToHClip(half3(v.vertex.xyz));
                o.normalOS = v.normal;
                return o;
            }

            half4 frag (VertexOutput IN) : SV_Target
            {
                UNITY_SETUP_INSTANCE_ID(IN);
                half3 wsNormal = TransformObjectToWorldNormal(IN.normalOS);
                return half4(wsNormal, 1);
                half4 color = UNITY_MATRIX_M[0].xyzz;
                //half4 color = UNITY_MATRIX_I_M[0].xyzw;
                //half4 color = unity_MatrixV[0].xyzw;
                //half4 color = unity_WorldToObject[0].xyzw;
                return color;
            }

            ENDHLSL
        }  
    }
    FallBack "Hidden/InternalErrorShader"
}

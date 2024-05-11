cmake_minimum_required(VERSION 3.27.2)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_EXPORT_COMPILE_COMMANDS 1)



project(nodebind)

include_directories($ENV{VSPROJ}/sci_libs)
include_directories($ENV{USRHOME}/AppData/Local/node-gyp/Cache/18.18.2/include/node)
include_directories($ENV{USRHOME}/AppData/Local/node-gyp/Cache/18.18.2/src)
include_directories($ENV{USRHOME}/AppData/Local/node-gyp/Cache/18.18.2/deps/openssl/config)
include_directories($ENV{USRHOME}/AppData/Local/node-gyp/Cache/18.18.2/deps/openssl/openssl/include)
include_directories($ENV{USRHOME}/AppData/Local/node-gyp/Cache/18.18.2/deps/uv/include)
include_directories($ENV{USRHOME}/AppData/Local/node-gyp/Cache/18.18.2/deps/zlib)
include_directories($ENV{USRHOME}/AppData/Local/node-gyp/Cache/18.18.2/deps/v8/include)
include_directories(./node_modules/node-addon-api)

add_compile_definitions(NODE_GYP_MODULE_NAME=nodebind)
add_compile_definitions( USING_UV_SHARED=1)
add_compile_definitions( USING_V8_SHARED=1)
add_compile_definitions( V8_DEPRECATION_WARNINGS=1)
add_compile_definitions( _HAS_EXCEPTIONS=1)
add_compile_definitions(HOST_BINARY="node.exe")
add_compile_definitions(V8_DEPRECATION_WARNINGS)
add_compile_definitions(V8_IMMINENT_DEPRECATION_WARNINGS)
add_compile_definitions(_GLIBCXX_USE_CXX11_ABI=1)
add_compile_definitions(BUILDING_NODE_EXTENSION)
add_compile_definitions(NAPI_DISABLE_CPP_EXCEPTIONS)
add_compile_definitions(WIN32)
add_compile_definitions(_CRT_SECURE_NO_DEPRECATE)
add_compile_definitions(_CRT_NONSTDC_NO_DEPRECATE)
add_compile_definitions(OPENSSL_NO_PINSHARED)
add_compile_definitions(OPENSSL_THREADS)


file(GLOB SOURCE_FILES
     "cpp/*.h"
     "cpp/*.cpp"
	 "cpp/*.cc"
)


add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

target_link_directories(${PROJECT_NAME} PRIVATE $ENV{VSPROJ}/sci_libs/libs)
target_link_directories(${PROJECT_NAME} PRIVATE $ENV{USRHOME}/AppData/Local/node-gyp/Cache/18.18.2/x64)
target_link_libraries(${PROJECT_NAME} scisuit_core DelayImp kernel32.lib
user32 gdi32 winspool comdlg32 advapi32 shell32 ole32 oleaut32 uuid odbc32 node)

target_link_options(${PROJECT_NAME} PRIVATE "/DELAYLOAD:node.exe")

add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
	COMMAND ${CMAKE_COMMAND} -E copy 
	$<TARGET_FILE:${PROJECT_NAME}> ${CMAKE_SOURCE_DIR}/build/${PROJECT_NAME}.node)






#ifdef RCT_NEW_ARCH_ENABLED
#import "RNMeasureTextSpec.h"

@interface MeasureText : NSObject <NativeMeasureTextSpec>
#else
#import <React/RCTBridgeModule.h>

@interface MeasureText : NSObject <RCTBridgeModule>
#endif

@end

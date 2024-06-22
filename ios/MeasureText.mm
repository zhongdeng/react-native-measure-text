#import "MeasureText.h"
#import <React/RCTFont.h>
#import <React/RCTConvert.h>
#import <React/RCTLayout.h>

@implementation MeasureText
RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_EXPORT_METHOD(multiply:(double)a
                  b:(double)b
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSNumber *result = @(a * b);

    resolve(result);
}

RCT_EXPORT_METHOD(measure:(NSString *)text
                    width:(CGFloat)width
                    style:(NSDictionary *)style
                    props:(NSDictionary *)props
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject)
{
    NSInteger numberOfLines = 0; // [RCTConvert NSInteger:props[@"numberOfLines"]];
    NSString *ellipsizeMode = @"tail"; // [RCTConvert NSString:props[@"ellipsizeMode"]];
    BOOL allowFontScaling = YES; // [RCTConvert BOOL:props[@"allowFontScaling"]];
    NSInteger maxFontSizeMultiplier = 1.0; // [RCTConvert NSInteger:props[@"maxFontSizeMultiplier"]];
    
    if (props[@"numberOfLines"]) {
        numberOfLines = [RCTConvert NSInteger:props[@"numberOfLines"]];
    }
    if (props[@"ellipsizeMode"]) {
        ellipsizeMode = [RCTConvert NSString:props[@"ellipsizeMode"]];
    }
    if (props[@"allowFontScaling"]) {
        allowFontScaling = [RCTConvert BOOL:props[@"allowFontScaling"]];
    }
    if (props[@"maxFontSizeMultiplier"]) {
        maxFontSizeMultiplier = [RCTConvert NSInteger:props[@"maxFontSizeMultiplier"]];
    }
    
    NSLog(@"numberOfLines: %zd, ellipsizeMode: %@, allowFontScaling: %i, maxFontSizeMultiplier: %zd", numberOfLines, ellipsizeMode, allowFontScaling, maxFontSizeMultiplier);
    
    UIFont *font = [RCTFont updateFont:nil
                            withFamily:[RCTConvert NSString:style[@"fontFamily"]]
                                  size:[RCTConvert NSNumber:style[@"fontSize"]]
                                weight:[RCTConvert NSString:style[@"fontWeight"]]
                                 style:[RCTConvert NSString:style[@"fontStyle"]]
                               variant:[RCTConvert NSStringArray:style[@"fontVariant"]]
                       scaleMultiplier:maxFontSizeMultiplier];
    if (!font) {
        reject(@"0", @"font style invalid", [NSError errorWithDomain:@"font style invalid" code:0 userInfo:nil]);
    }
    
    NSString *transformText = NSStringFromTextTransfrom(text, [RCTConvert NSString:style[@"textTransform"]]);
    
    CGSize maximumSize = CGSizeMake(width, CGFLOAT_MAX);
    CGFloat letterSpacing = [RCTConvert CGFloat:style[@"letterSpacing"]];
    
    CGFloat lineHeight = [RCTConvert CGFloat:style[@"lineHeight"]];
    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    paragraphStyle.minimumLineHeight = lineHeight;
    paragraphStyle.maximumLineHeight = lineHeight;
    
    NSTextContainer *textContainer = [[NSTextContainer alloc] initWithSize:maximumSize];
    textContainer.lineFragmentPadding = 0.0; // Note, the default value is 5.
    textContainer.lineBreakMode = numberOfLines > 0 ? NSLineBreakModeFromEllipsizeMode(ellipsizeMode) : NSLineBreakByClipping;
    textContainer.maximumNumberOfLines = numberOfLines;
    
    NSLayoutManager *layoutManager = [NSLayoutManager new];
    layoutManager.usesFontLeading = NO;
    layoutManager.allowsNonContiguousLayout = YES;
    [layoutManager addTextContainer:textContainer];
    
    NSTextStorage *textStorage = [[NSTextStorage alloc] initWithString:transformText
                                                            attributes:@{
        NSFontAttributeName: font,
        NSKernAttributeName: @(letterSpacing),
        NSParagraphStyleAttributeName: paragraphStyle
    }];
    [textStorage addLayoutManager:layoutManager];
    
    [layoutManager ensureLayoutForTextContainer:textContainer];
    CGSize size = [layoutManager usedRectForTextContainer:textContainer].size;
    
    if (!isnan(letterSpacing) && letterSpacing < 0) {
      size.width -= letterSpacing;
    }

    size = (CGSize){
        MIN(RCTCeilPixelValue(size.width), maximumSize.width), MIN(RCTCeilPixelValue(size.height), maximumSize.height)};

    CGFloat epsilon = 1 / [UIScreen mainScreen].scale; // 0.001;
    resolve(@(RCTYogaFloatFromCoreGraphicsFloat(size.height + epsilon)));
}

static NSLineBreakMode NSLineBreakModeFromEllipsizeMode(NSString *ellipsizeMode) {
    if ([ellipsizeMode isEqualToString:@"clip"]) {
        return NSLineBreakByClipping;
    } else if ([ellipsizeMode isEqualToString:@"head"]) {
        return NSLineBreakByTruncatingHead;
    } else if ([ellipsizeMode isEqualToString:@"middle"]) {
        return NSLineBreakByTruncatingMiddle;
    } else {
        return NSLineBreakByTruncatingTail;
    }
}

static NSString *NSStringFromTextTransfrom(NSString *text, NSString *textTransform) {
    if ([textTransform isEqualToString:@"uppercase"]) {
        return [text uppercaseString];
    } else if ([textTransform isEqualToString:@"lowercase"]) {
        return [text lowercaseString];
    } else if ([textTransform isEqualToString:@"capitalize"]) {
        return CapitalizeText(text);
    } else {
        return text;
    }
}

static NSString *CapitalizeText(NSString *text)
{
  NSArray *words = [text componentsSeparatedByString:@" "];
  NSMutableArray *newWords = [NSMutableArray new];
  NSNumberFormatter *num = [NSNumberFormatter new];
  for (NSString *item in words) {
    NSString *word;
    if ([item length] > 0 && [num numberFromString:[item substringWithRange:NSMakeRange(0, 1)]] == nil) {
      word = [item capitalizedString];
    } else {
      word = [item lowercaseString];
    }
    [newWords addObject:word];
  }
  return [newWords componentsJoinedByString:@" "];
}

@end

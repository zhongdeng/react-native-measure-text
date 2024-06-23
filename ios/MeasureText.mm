#import "MeasureText.h"
#import <React/RCTFont.h>
#import <React/RCTConvert.h>
#import <React/RCTLayout.h>

@implementation MeasureText
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(measureSingleText:(NSString *)text
                    width:(CGFloat)width
                    style:(NSDictionary *)style
                    props:(NSDictionary *)props
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject)
{
    NSArray<NSDictionary *> *sizes = [MeasureText measure:@[text]
                                                    width:width
                                                    style:style
                                                    props:props];
    resolve(sizes[0]);
}

RCT_EXPORT_METHOD(measureMultipleText:(NSArray<NSString *> *)texts
                        width:(CGFloat)width
                        style:(NSDictionary *)style
                        props:(NSDictionary *)props
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject)
{
    NSArray<NSDictionary *> *sizes = [MeasureText measure:texts 
                                                    width:width
                                                    style:style
                                                    props:props];
    NSMutableArray<NSNumber *> *heights = [NSMutableArray arrayWithCapacity:sizes.count];
    resolve(sizes);
}

+ (NSArray<NSDictionary *> *)measure:(NSArray<NSString *> *)texts
                               width:(CGFloat)width
                               style:(NSDictionary *)style
                               props:(NSDictionary *)props
{
    NSInteger numberOfLines = 0;
    NSString *ellipsizeMode = @"tail";
    BOOL allowFontScaling = YES;
    NSInteger maxFontSizeMultiplier = 1.0;
    
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
    
    UIFont *font = [RCTFont updateFont:nil
                            withFamily:[RCTConvert NSString:style[@"fontFamily"]]
                                  size:[RCTConvert NSNumber:style[@"fontSize"]]
                                weight:[RCTConvert NSString:style[@"fontWeight"]]
                                 style:[RCTConvert NSString:style[@"fontStyle"]]
                               variant:[RCTConvert NSStringArray:style[@"fontVariant"]]
                       scaleMultiplier:maxFontSizeMultiplier];
    
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
    
    NSDictionary<NSAttributedStringKey, id> *attributes = @{
        NSFontAttributeName: font,
        NSKernAttributeName: @(letterSpacing),
        NSParagraphStyleAttributeName: paragraphStyle
    };
    
    NSMutableArray<NSDictionary *> *sizes = [NSMutableArray arrayWithCapacity:texts.count];
    NSString *textTransform = [RCTConvert NSString:style[@"textTransform"]];
    for (NSString *text in texts) {
        NSString *transformText = NSStringFromTextTransfrom(text, textTransform);
        
        NSTextStorage *textStorage = [[NSTextStorage alloc] initWithString:transformText
                                                                attributes:attributes];
        [textStorage addLayoutManager:layoutManager];
        [layoutManager ensureLayoutForTextContainer:textContainer];
        CGSize size = [layoutManager usedRectForTextContainer:textContainer].size;
        
        if (!isnan(letterSpacing) && letterSpacing < 0) {
          size.width -= letterSpacing;
        }

        size = (CGSize){
            MIN(RCTCeilPixelValue(size.width), maximumSize.width), MIN(RCTCeilPixelValue(size.height), maximumSize.height)};

        CGFloat epsilon = 0.001;
        CGFloat width = RCTYogaFloatFromCoreGraphicsFloat(size.width + epsilon);
        CGFloat height = RCTYogaFloatFromCoreGraphicsFloat(size.height + epsilon);
        
        [sizes addObject:@{@"width": @(width), @"height": @(height)}];
    }
    
    return [sizes copy];
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

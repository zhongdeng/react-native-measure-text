package com.measuretext;

import androidx.annotation.NonNull;

import android.graphics.text.LineBreaker;
import android.os.Build;
import android.text.BoringLayout;
import android.text.Layout;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.util.Log;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.DisplayMetricsHolder;
import com.facebook.react.views.text.ReactTypefaceUtils;
import com.facebook.react.views.text.TextAttributes;
import com.facebook.react.views.text.TextTransform;
import com.facebook.react.views.text.internal.span.CustomLetterSpacingSpan;
import com.facebook.react.views.text.internal.span.CustomLineHeightSpan;
import com.facebook.react.views.text.internal.span.CustomStyleSpan;
import com.facebook.yoga.YogaConstants;

@ReactModule(name = MeasureTextModule.NAME)
public class MeasureTextModule extends ReactContextBaseJavaModule {
  public static final String NAME = "MeasureText";
  private final ReactApplicationContext mReactContext;

  public MeasureTextModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactContext = reactContext;
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void measureSingleText(String text, float width, ReadableMap style, ReadableMap props, Promise promise) {
    if (width < 0) {
      promise.reject(new Error("width must be greater than or equal to 0"));
    }

    try {
      ReadableMap size = MeasureTextModule.measureText(text, width, style, props, mReactContext);
      promise.resolve(size);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void measureMultipleText(ReadableArray texts, float width, ReadableMap style, ReadableMap props, Promise promise) {
    try {
      WritableArray sizes = Arguments.createArray();
      for (int i = 0; i < texts.size(); i++) {
        String text = texts.getString(i);
        ReadableMap size = MeasureTextModule.measureText(text, width, style, props, mReactContext);
        sizes.pushMap(size);
      }
      promise.resolve(sizes);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  private static ReadableMap measureText(String text, float width, ReadableMap style, ReadableMap props, ReactApplicationContext reactContext) {
    int numberOfLines = 0;
    if (props.hasKey("numberOfLines")) {
      int value = props.getInt("numberOfLines");
      if (value >= 0) {
        numberOfLines = value;
      }
      Log.d("PROPS", "numberOfLines: " + numberOfLines);
    }

    boolean allowFontScaling = true;
    if (props.hasKey("allowFontScaling")) {
      boolean value = props.getBoolean("allowFontScaling");
      allowFontScaling = value;
      Log.d("PROPS", "allowFontScaling: " + allowFontScaling);
    }

    int textBreakStrategy = LineBreaker.BREAK_STRATEGY_HIGH_QUALITY;
    if (props.hasKey("textBreakStrategy")) {
      String value = props.getString("textBreakStrategy");
      if (value != null && !"highQuality".equals(value)) {
        if ("simple".equals(value)) {
          textBreakStrategy = LineBreaker.BREAK_STRATEGY_SIMPLE;
        } else if ("balanced".equals(value)) {
          textBreakStrategy = LineBreaker.BREAK_STRATEGY_HIGH_QUALITY;
        } else {
          textBreakStrategy = LineBreaker.BREAK_STRATEGY_HIGH_QUALITY;
        }
      } else {
        textBreakStrategy = LineBreaker.BREAK_STRATEGY_HIGH_QUALITY;
      }
      Log.d("PROPS", "textBreakStrategy: " + value);
    }

    int hyphenationFrequency = Layout.HYPHENATION_FREQUENCY_NONE;
    if (props.hasKey("android_hyphenationFrequency")) {
      String value = props.getString("android_hyphenationFrequency");
      if (value != null) {
        switch (value) {
          case "normal":
            hyphenationFrequency = Layout.HYPHENATION_FREQUENCY_NORMAL;
            break;
          case "none":
            hyphenationFrequency = Layout.HYPHENATION_FREQUENCY_NONE;
            break;
          case "full":
            hyphenationFrequency = Layout.HYPHENATION_FREQUENCY_FULL;
        }
      }
      Log.d("PROPS", "hyphenationFrequency: " + value);
    }

    TextAttributes textAttributes = new TextAttributes();
    textAttributes.setAllowFontScaling(allowFontScaling);

    if (style.hasKey("textTransform")) {
      String textTransformString = style.getString("textTransform");
      TextTransform textTransform = TextTransform.NONE;
      if (textTransformString != null) {
        switch (textTransformString) {
          case "uppercase":
            text = text.toUpperCase();
            textTransform = TextTransform.UPPERCASE;
            break;
          case "lowercase":
            text = text.toLowerCase();
            textTransform = TextTransform.LOWERCASE;
            break;
          case "capitalize":
            text = Character.toUpperCase(text.charAt(0)) + text.substring(1);
            textTransform = TextTransform.CAPITALIZE;
            break;
        }
      }
      textAttributes.setTextTransform(textTransform);
      Log.d("STYLE", "textTransform: " + textTransformString);
    }

    SpannableString spannableString = new SpannableString(text);

    // maxFontSizeMultiplier must set before fontSize/lineHeight/letterSpacing
    if (style.hasKey("maxFontSizeMultiplier")) {
      float maxFontSizeMultiplier = (float) style.getDouble("maxFontSizeMultiplier");
      textAttributes.setMaxFontSizeMultiplier(maxFontSizeMultiplier);
      Log.d("STYLE", "maxFontSizeMultiplier: " + maxFontSizeMultiplier);
    }

    if (style.hasKey("fontSize")) {
      float fontSize = (float) style.getDouble("fontSize");
      textAttributes.setFontSize(fontSize);
      Log.d("STYLE", "fontSize: " + fontSize);
    }

    if (style.hasKey("lineHeight")) {
      float lineHeight = (float) style.getDouble("lineHeight");
      textAttributes.setLineHeight(lineHeight);
      CustomLineHeightSpan customLineHeightSpan = new CustomLineHeightSpan(textAttributes.getEffectiveLineHeight());
      spannableString.setSpan(customLineHeightSpan, 0, spannableString.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
      Log.d("STYLE", "lineHeight: " + lineHeight);
    }

    if (style.hasKey("letterSpacing")) {
      float letterSpacing = (float) style.getDouble("letterSpacing");
      textAttributes.setLetterSpacing(letterSpacing);
      CustomLetterSpacingSpan customLetterSpacingSpan = new CustomLetterSpacingSpan(textAttributes.getEffectiveLetterSpacing());
      spannableString.setSpan(customLetterSpacingSpan, 0, spannableString.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
      Log.d("STYLE", "letterSpacing: " + letterSpacing);
    }

    if (style.hasKey("fontFamily") || style.hasKey("fontStyle") || style.hasKey("fontWeight")) {
      int fontStyle = ReactTypefaceUtils.parseFontStyle(style.getString("fontStyle"));
      Log.d("STYLE", "fontStyle: " + fontStyle);

      int fontWeight = ReactTypefaceUtils.parseFontWeight(style.getString("fontWeight"));
      Log.d("STYLE", "fontWeight: " + fontWeight);

      String fontFamily = style.getString("fontFamily");
      Log.d("STYLE", "fontFamily: " + fontFamily);

      CustomStyleSpan customStyleSpan = new CustomStyleSpan(fontStyle,fontWeight, null, fontFamily, reactContext.getAssets());
      spannableString.setSpan(customStyleSpan, 0, spannableString.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }

    boolean includeFontPadding = true;
    if (style.hasKey("includeFontPadding")) {
      includeFontPadding = style.getBoolean("includeFontPadding");
      Log.d("STYLE", "includeFontPadding: " + includeFontPadding);
    }

    Layout.Alignment alignment = Layout.Alignment.ALIGN_NORMAL;
    int justificationMode = LineBreaker.JUSTIFICATION_MODE_NONE;
    int textAlign;
    if (style.hasKey("textAlign")) {
      String textAlignString = style.getString("textAlign");
      if ("justify".equals(textAlignString)) {
        if (Build.VERSION.SDK_INT >= 26) {
          justificationMode = LineBreaker.JUSTIFICATION_MODE_INTER_WORD;
        }
        textAlign = 3;
      } else {
        if (Build.VERSION.SDK_INT >= 26) {
          justificationMode = LineBreaker.JUSTIFICATION_MODE_NONE;
        }

        if (textAlignString != null && !"auto".equals(textAlignString)) {
          if ("left".equals(textAlignString)) {
            textAlign = 3;
          } else if ("right".equals(textAlignString)) {
            textAlign = 5;
          } else if ("center".equals(textAlignString)) {
            textAlign = 1;
          } else {
            FLog.w("ReactNative", "Invalid textAlign: " + textAlignString);
            textAlign = 0;
          }
        } else {
          textAlign = 0;
        }
      }

      // un-support RTL
      switch (textAlign) {
        case 1:
          alignment = Layout.Alignment.ALIGN_CENTER;
        case 2:
        case 4:
        default:
          break;
        case 3:
          alignment = Layout.Alignment.ALIGN_NORMAL;
          break;
        case 5:
          alignment = Layout.Alignment.ALIGN_OPPOSITE;
      }
      Log.d("STYLE", "textAlign: " + textAlignString);
    }

    float density = DisplayMetricsHolder.getWindowDisplayMetrics().density;
    width *= density;

    TextPaint textPaint = new TextPaint(TextPaint.ANTI_ALIAS_FLAG);
    textPaint.setTextSize(textAttributes.getEffectiveFontSize());

    BoringLayout.Metrics boring = BoringLayout.isBoring(spannableString, textPaint);
    float desiredWidth = boring == null ? Layout.getDesiredWidth(spannableString, textPaint) : Float.NaN;
    boolean unconstrainedWidth = false;

    Layout layout;
    if (boring == null && (unconstrainedWidth || !YogaConstants.isUndefined(desiredWidth) && desiredWidth <= width)) {
      int hintWidth = (int)Math.ceil((double)desiredWidth);
      StaticLayout.Builder builder = StaticLayout.Builder.obtain(spannableString, 0, spannableString.length(), textPaint, hintWidth).setAlignment(alignment).setLineSpacing(0.0F, 1.0F).setIncludePad(includeFontPadding).setBreakStrategy(textBreakStrategy).setHyphenationFrequency(hyphenationFrequency);
      if (Build.VERSION.SDK_INT >= 26) {
        builder.setJustificationMode(justificationMode);
      }

      if (Build.VERSION.SDK_INT >= 28) {
        builder.setUseLineSpacingFromFallbacks(true);
      }

      layout = builder.build();
    } else if (boring != null && (unconstrainedWidth || (float)boring.width <= width)) {
      layout = BoringLayout.make(spannableString, textPaint, Math.max(boring.width, 0), alignment, 1.0F, 0.0F, boring, includeFontPadding);
    } else {
      if (Build.VERSION.SDK_INT > 29) {
        width = (float)Math.ceil((double)width);
      }

      StaticLayout.Builder builder = StaticLayout.Builder.obtain(spannableString, 0, spannableString.length(), textPaint, (int)width).setAlignment(alignment).setLineSpacing(0.0F, 1.0F).setIncludePad(includeFontPadding).setBreakStrategy(textBreakStrategy).setHyphenationFrequency(hyphenationFrequency);
      if (Build.VERSION.SDK_INT >= 28) {
        builder.setUseLineSpacingFromFallbacks(true);
      }

      layout = builder.build();
    }

    int lineCount = numberOfLines > 0 ? Math.min(numberOfLines, layout.getLineCount()) : layout.getLineCount();
    float layoutWidth = layout.getWidth();
    float layoutHeight =  layout.getLineBottom(lineCount - 1);

    WritableMap result = Arguments.createMap();
    result.putDouble("width", layoutWidth / density);
    result.putDouble("height", layoutHeight / density);
    return result;
  }
}

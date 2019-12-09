package com.bleashup.bleashup;

import android.app.Application;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactApplication; 
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // <-- Add this line
import org.wonday.orientation.OrientationPackage;
import com.calendarevents.CalendarEventsPackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage; // <-- Add this line
import com.kevinresol.react_native_sound_recorder.RNSoundRecorderPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.mg.app.PickerPackage;
import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.peel.react.TcpSocketsModule;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.chirag.RNMail.*;  // <--- import 
import com.rnnestedscrollview.RNNestedScrollViewPackage;
//import android.support.v7.app.AppCompatActivity;
import com.swmansion.reanimated.ReanimatedPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import com.proyecto26.inappbrowser.RNInAppBrowserPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage(),
            new OrientationPackage(),
            new RNFirebaseDatabasePackage(),
            new RNNestedScrollViewPackage(),
            new RNFirebaseNotificationsPackage(),
            new RNSoundRecorderPackage(),
            new DocumentPickerPackage(),
            new PickerPackage(),
            new CalendarEventsPackage(),
            new RNFileViewerPackage(),
            new RNDateTimePickerPackage(),
            new ReactVideoPackage(),
            new RNSoundPackage(),
            new RNFirebaseMessagingPackage(),
            new SvgPackage(),
            new AsyncStoragePackage(),
            new VectorIconsPackage(),
            new RNExitAppPackage(),
            new ReanimatedPackage(),
            new TcpSocketsModule(),
            new RNMail() ,
            new NetInfoPackage(),
            new RNGestureHandlerPackage(),
            new RNFetchBlobPackage(),
            new ImagePickerPackage(),
            new RNDateTimePickerPackage(),
            new RNInAppBrowserPackage(),
            new RNDeviceInfo()
        );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

  }
}

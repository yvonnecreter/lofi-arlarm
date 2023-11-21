mergeInto(LibraryManager.library, {
  MouseUp: function () {
    window.dispatchReactUnityEvent("MouseUp");
  },
});
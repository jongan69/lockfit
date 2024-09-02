export const handleScroll = (event: any, setTabBarVisible: any) => {
  const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
  const paddingToBottom = 20;
  const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= 
    contentSize.height - paddingToBottom;
  
  if (layoutMeasurement && contentOffset && contentSize && setTabBarVisible) {
    if (contentSize.height <= layoutMeasurement.height) {
      // Content is shorter than or equal to screen height, keep tab bar visible
      setTabBarVisible(true);
    } else {
      // Content is taller than screen height, hide tab bar when close to bottom
      setTabBarVisible(!isCloseToBottom);
    }
  }
};
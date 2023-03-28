import { Modal, useWindowDimensions } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import ImageViewer from "react-native-reanimated-image-viewer";

export const CustomImageViewer = ({closeModal, visible, imageUrl}) => {
    const {width} = useWindowDimensions()
    return (
        <Modal onRequestClose={closeModal} visible={visible} onDismiss={closeModal}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ImageViewer
              imageUrl={imageUrl}
              width={width}
              height={width}
              onRequestClose={closeModal}
            />
          </GestureHandlerRootView>
        </Modal>
    )
}
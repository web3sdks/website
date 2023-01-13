import {
  Drawer as ChakraDrawer,
  DrawerProps as ChakraDrawerProps,
  CloseButtonProps,
  Divider,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  ModalBodyProps,
  ModalFooterProps,
  ModalHeaderProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ComponentWithChildren } from "types/component-with-children";

export interface DrawerProps extends Omit<ChakraDrawerProps, "placement"> {
  header?: ModalHeaderProps;
  drawerBodyProps?: ModalBodyProps;
  closeButtonProps?: CloseButtonProps;
  footer?: ModalFooterProps;
  hideCloseButton?: true;
}

export const Drawer: ComponentWithChildren<DrawerProps> = ({
  children,
  header,
  drawerBodyProps,
  footer,
  hideCloseButton,
  closeButtonProps,
  ...restDrawerProps
}) => {
  const isMobile = useBreakpointValue(
    { base: true, md: false },
    { fallback: "md" },
  );
  return (
    <ChakraDrawer
      {...restDrawerProps}
      allowPinchZoom
      preserveScrollBarGap
      placement={isMobile ? "bottom" : "right"}
    >
      <DrawerOverlay zIndex="modal" />
      <DrawerContent
        maxH="calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
        overflow="hidden"
        borderTopRadius={{ base: "2xl", md: "none" }}
      >
        {!hideCloseButton && <DrawerCloseButton {...closeButtonProps} />}
        {header && (
          <>
            <DrawerHeader {...header} />
            <Divider />
          </>
        )}
        <DrawerBody
          {...drawerBodyProps}
          pt="max(var(--chakra-space-4), env(safe-area-inset-top))"
          pb="max(var(--chakra-space-4), env(safe-area-inset-bottom))"
        >
          {children}
        </DrawerBody>
        {footer && (
          <>
            <Divider />
            <DrawerFooter {...footer} />
          </>
        )}
      </DrawerContent>
    </ChakraDrawer>
  );
};

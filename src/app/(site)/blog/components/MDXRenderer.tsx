import { getMDXComponent } from 'next-contentlayer/hooks';
// import type { NestedMDXComponents } from 'mdx/types';
import MDXComponents from '~/app/(site)/blog/components/MDXComponents';

/**
 * This is the global JSX.ElementType if it’s defined, otherwise never.
 */
// @ts-ignore JSX runtimes may optionally define JSX.ElementType. The MDX types need to work regardless whether this is
// defined or not.
type ElementType = any extends JSX.ElementType ? never : JSX.ElementType;

/**
 * This matches any function component types that ar part of `ElementType`.
 */
type FunctionElementType = Extract<ElementType, (props: Record<string, any>) => any>;

/**
 * This matches any class component types that ar part of `ElementType`.
 */
type ClassElementType = Extract<ElementType, new(props: Record<string, any>) => any>;

/**
 * A valid JSX string component.
 */
type StringComponent = Extract<keyof JSX.IntrinsicElements, ElementType extends never ? string : ElementType>;

/**
 * A valid JSX function component.
 */
type FunctionComponent<Props> = ElementType extends never
    // If JSX.ElementType isn’t defined, the valid return type is JSX.Element
    ? (props: Props) => JSX.Element | null
    : FunctionElementType extends never
    // If JSX.ElementType is defined, but doesn’t allow function components, function components are disallowed.
        ? never
    // If JSX.ElementType allows function components, its return value determines what is a valid.
    : (props: Props) => ReturnType<FunctionElementType>;

/**
 * A valid JSX class component.
 */
type ClassComponent<Props> = ElementType extends never
    // If JSX.ElementType isn’t defined, the valid return type is a constructor that returns JSX.ElementClass
    ? new(props: Props) => JSX.ElementClass
    : ClassElementType extends never
    // If JSX.ElementType is defined, but doesn’t allow constructors, function components are disallowed.
        ? never
    // If JSX.ElementType allows class components, its return value determines what is a valid.
    : new(props: Props) => InstanceType<ClassElementType>;

/**
 * Any allowed JSX component.
 */
type Component<Props> = FunctionComponent<Props> | ClassComponent<Props> | StringComponent;

interface NestedMDXComponents {
    [key: string]: NestedMDXComponents | Component<any>;
}

function Mdx({
  code,
}: React.PropsWithChildren<{
  code: string;
}>) {
  const Component = getMDXComponent(code);

  return <Component components={MDXComponents as NestedMDXComponents} />;
}

export default Mdx;

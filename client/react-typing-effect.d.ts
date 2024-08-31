declare module 'react-typing-effect' {
    import { FC } from 'react';

    interface ReactTypingEffectProps {
        text: string[];
        speed?: number;
        eraseSpeed?: number;
        typingDelay?: number;
        eraseDelay?: number;
        cursor?: string;
        staticText?: string;
    }

    const ReactTypingEffect: FC<ReactTypingEffectProps>;
    declare module 'react-typing-effect' {
        const content: any;
        export default content;
    }

    export default ReactTypingEffect;
}

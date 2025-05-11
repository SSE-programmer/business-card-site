import { IMediaQuery } from '../../models/IMediaQuery';

export class TooltipConfig<D = any> {
    boundariesElement?: HTMLElement;
    stickingElement: HTMLElement;
    data: D;
    width?: string;
    mediaQueries?: IMediaQuery[];
    onCloseCallback?: () => any;
    popperOptions?: object;
    isStatic = true;
}

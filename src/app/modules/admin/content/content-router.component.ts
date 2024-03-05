import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector       : 'content-router',
    templateUrl    : 'content-router.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [RouterOutlet],
})
export class ContentRouter
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
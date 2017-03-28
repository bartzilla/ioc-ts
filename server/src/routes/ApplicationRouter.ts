import {Router, Request, Response, NextFunction} from 'express';
import {ApplicationService} from "../services/application/ApplicationService";
import {Application} from "../domain/Application";
import "reflect-metadata";
import {injectable, inject} from "inversify";
import TYPES from "../services/types/service-types";
import {Account} from "../domain/Account";

@injectable()
export class ApplicationRouter {
    private applicationService: ApplicationService;
    private router: Router;

    /**
     * Initialize the ApplicationRouter
     */
    public constructor(@inject(TYPES.ApplicationService) applicationService?: ApplicationService) {
        this.applicationService = applicationService;
        this.router = Router();
        this.init();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/:tenantId/applications', this.addApplication);
    }

    public addApplication = (req: Request, res: Response, next: NextFunction) =>  {

        let tenantId = req.params.tenantId;

        if(req.body.applicationName && req.body.applicationName.length >= 0) {

            // Create Application
            let newApplication = new Application( "sable-sun");
            this.applicationService.registerNewApplication(tenantId, newApplication, function(err, application){
                if(err) {
                    console.log('[APPLICATION]: ERROR: Could not add application.', err);
                    return res.status(500).json({success: false, message: 'Error adding application.'});
                }
                else {
                    return res.status(200).json(application);
                }
            });
        }else {
            return res.status(400).json({success: false, message: 'Required parameters "applicationName" must be specified'});
        }
    };

    public getRouter(): Router {
        return this.router;
    }
}
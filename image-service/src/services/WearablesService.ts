import { getItemGroupByType } from '$shared/domain/items';
import type { ArtefactType, DuckConnections } from '$shared/types';
import { toRecord } from '$shared/utils';

class WearablesService {
    private isArtefact = (name: string): name is ArtefactType => name.includes('ART-');

    collect = (artefacts: string[]): DuckConnections => toRecord(artefacts.filter(this.isArtefact), getItemGroupByType);
}

const wearablesService = new WearablesService();

export default wearablesService;

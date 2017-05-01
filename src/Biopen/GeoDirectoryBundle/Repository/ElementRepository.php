<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-05-01 09:03:18
 */
 

namespace Biopen\GeoDirectoryBundle\Repository;
use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * ElementRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ElementRepository extends DocumentRepository
{
  public function findAround($lat, $lng, $distance)
  {
    $qb = $this->createQueryBuilder('BiopenGeoDirectoryBundle:Element');

    // convert kilometre in degrees
    $radius = $distance / 110;
    return $qb->field('coordinates')->withinCenter($lat, $lng, $radius)
              ->select('json')->hydrate(false)->getQuery()->execute()->toArray(); 
  }

  public function findWhithinBoxes($bounds, $optionId)
  {
    $results = [];

    $qb = $this->createQueryBuilder('BiopenGeoDirectoryBundle:Element');

    //dump("quering optionId " . $optionId);

    foreach ($bounds as $key => $bound) 
    {
      if (count($bound) == 4)
      {
        if ($optionId && $optionId != "all")
        {
          //$qb->where("function() { return this.optionValues.some(function(optionValue) { return optionValue.optionId == " . $optionId . "; }); }");
          $qb->field('optionValues.optionId')->in(array((float) $optionId));
        }
        $array =  $qb->field('coordinates')->withinBox((float) $bound[1], (float) $bound[0], (float) $bound[3], (float) $bound[2])
                    ->select('json')->hydrate(false)->getQuery()->execute()->toArray(); 

        $results = array_merge($results, $array);  
      }
    }

    return $results;
  }
}


